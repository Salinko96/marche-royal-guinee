import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

// Vidéo 2: Cartier
async function video2() {
  const zai = await ZAI.create();
  const imageBuffer = fs.readFileSync('/home/z/my-project/public/precious duke.jpg');
  const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

  const task = await zai.video.generations.create({
    image_url: base64Image,
    prompt: "Elegant Cartier inspired classic watch, timeless luxury timepiece presentation, graceful rotation displaying the refined dial and leather strap, sophisticated French haute horlogerie style, soft studio lighting highlighting the polished case, professional watch photography cinematography, smooth elegant camera movements",
    quality: 'quality',
    duration: 5,
    fps: 30
  });

  console.log('Cartier task:', task.id);
  
  let result = await zai.async.result.query(task.id);
  let pollCount = 0;
  
  while (result.task_status === 'PROCESSING' && pollCount < 120) {
    pollCount++;
    await new Promise(r => setTimeout(r, 5000));
    result = await zai.async.result.query(task.id);
    console.log(`Cartier: ${pollCount}/120 - ${result.task_status}`);
  }

  const url = (result as any).video_result?.[0]?.url;
  console.log('Cartier URL:', url);
  fs.writeFileSync('/home/z/my-project/download/video_cartier.txt', url || 'failed');
  return url;
}

video2();
