import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function generateVideo() {
  try {
    console.log('🎬 Initialisation de Z-AI SDK...');
    const zai = await ZAI.create();

    // Lire l'image en base64
    const imagePath = '/home/z/my-project/public/Luxury Big Window AG Glass Matte.jpeg';
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

    console.log('📤 Création de la tâche de génération vidéo...');
    
    const task = await zai.video.generations.create({
      image_url: base64Image,
      prompt: 'Premium AG Glass phone case showcase, luxury matte finish, elegant rotation animation, professional product display with smooth camera movement, high-end smartphone accessory presentation',
      quality: 'quality',
      duration: 5,
      fps: 30
    });

    console.log('✅ Tâche créée:', task.id);
    console.log('⏳ Statut initial:', task.task_status);

    // Polling pour le résultat
    let result = await zai.async.result.query(task.id);
    let pollCount = 0;
    const maxPolls = 120;
    const pollInterval = 5000;

    console.log('🔄 En attente de la génération vidéo...');

    while (result.task_status === 'PROCESSING' && pollCount < maxPolls) {
      pollCount++;
      console.log(`📊 Poll ${pollCount}/${maxPolls}: ${result.task_status}`);
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      result = await zai.async.result.query(task.id);
    }

    if (result.task_status === 'SUCCESS') {
      const videoUrl = (result as any).video_result?.[0]?.url ||
                      (result as any).video_url ||
                      (result as any).url ||
                      (result as any).video;
      
      console.log('🎉 Vidéo générée avec succès!');
      console.log('🎥 URL de la vidéo:', videoUrl);
      
      // Sauvegarder l'URL dans un fichier
      const resultPath = '/home/z/my-project/download/ag_glass_video_url.txt';
      fs.writeFileSync(resultPath, videoUrl);
      console.log('📁 URL sauvegardée dans:', resultPath);
      
      return videoUrl;
    } else {
      console.log('❌ Échec de la génération:', result);
      return null;
    }
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    throw error;
  }
}

generateVideo();
