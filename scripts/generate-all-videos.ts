import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function generateVideo(zai: any, imagePath: string, prompt: string, productName: string): Promise<string | null> {
  try {
    console.log(`\n🎬 Génération vidéo pour: ${productName}`);
    
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

    const task = await zai.video.generations.create({
      image_url: base64Image,
      prompt: prompt,
      quality: 'quality',
      duration: 5,
      fps: 30
    });

    console.log(`   ✅ Tâche créée: ${task.id}`);

    let result = await zai.async.result.query(task.id);
    let pollCount = 0;
    const maxPolls = 120;

    while (result.task_status === 'PROCESSING' && pollCount < maxPolls) {
      pollCount++;
      process.stdout.write(`\r   📊 ${productName}: Poll ${pollCount}/${maxPolls} - ${result.task_status}   `);
      await new Promise(resolve => setTimeout(resolve, 5000));
      result = await zai.async.result.query(task.id);
    }

    if (result.task_status === 'SUCCESS') {
      const videoUrl = (result as any).video_result?.[0]?.url ||
                      (result as any).video_url ||
                      (result as any).url ||
                      (result as any).video;
      
      console.log(`\n   🎉 ${productName} terminée!`);
      console.log(`   🎥 URL: ${videoUrl}`);
      return videoUrl;
    } else {
      console.log(`\n   ❌ Échec pour ${productName}`);
      return null;
    }
  } catch (error: any) {
    console.error(`\n   ❌ Erreur ${productName}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Génération de vidéos professionnelles pour tous les produits...\n');
  
  const zai = await ZAI.create();

  const products = [
    {
      name: "Montre Richard Mille",
      image: "/home/z/my-project/public/blanche.jpg",
      prompt: "Luxury Richard Mille inspired watch, premium timepiece showcase, elegant rotation showing dial details, high-end horlogerie presentation, sophisticated lighting reflections on the watch face, professional product cinematography, smooth camera movement revealing the craftsmanship, gold and black accents gleaming under studio lights"
    },
    {
      name: "Montre Cartier",
      image: "/home/z/my-project/public/precious duke.jpg",
      prompt: "Elegant Cartier inspired classic watch, timeless luxury timepiece presentation, graceful rotation displaying the refined dial and leather strap, sophisticated French haute horlogerie style, soft studio lighting highlighting the polished case, professional watch photography cinematography, smooth elegant camera movements"
    },
    {
      name: "Coque AG Glass",
      image: "/home/z/my-project/public/Luxury Big Window AG Glass Matte.jpeg",
      prompt: "Premium AG Glass phone case showcase, luxury matte finish texture close-up, elegant rotation animation showing the sleek design, professional tech accessory display with smooth camera movement, high-end smartphone protection product cinematography, studio lighting revealing the premium materials"
    }
  ];

  const results: { name: string; url: string | null }[] = [];

  for (const product of products) {
    const url = await generateVideo(zai, product.image, product.prompt, product.name);
    results.push({ name: product.name, url });
    
    // Sauvegarder immédiatement
    if (url) {
      fs.writeFileSync(
        `/home/z/my-project/download/${product.name.replace(/\s+/g, '_').toLowerCase()}_video.txt`,
        url
      );
    }
  }

  console.log('\n\n📋 RÉSUMÉ DES VIDÉOS GÉNÉRÉES:');
  console.log('='.repeat(50));
  
  results.forEach(r => {
    console.log(`${r.name}: ${r.url || 'ÉCHEC'}`);
  });

  // Sauvegarder toutes les URLs dans un fichier JSON
  const allUrls: Record<string, string> = {};
  results.forEach(r => {
    if (r.url) allUrls[r.name] = r.url;
  });
  fs.writeFileSync('/home/z/my-project/download/all_videos.json', JSON.stringify(allUrls, null, 2));
  console.log('\n📁 URLs sauvegardées dans /home/z/my-project/download/all_videos.json');
}

main();
