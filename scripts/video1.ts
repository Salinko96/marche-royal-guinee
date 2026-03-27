import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

// Vidéo 1: Richard Mille
async function video1() {
  const zai = await ZAI.create();
  const imageBuffer = fs.readFileSync('/home/z/my-project/public/blanche.jpg');
  const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

  const task = await zai.video.generations.create({
    image_url: base64Image,
    prompt: "Luxury Richard Mille inspired watch, premium timepiece showcase, elegant rotation showing dial details, high-end horlogerie presentation, sophisticated lighting reflections on the watch face, professional product cinematography, smooth camera movement revealing the craftsmanship, gold and black accents gleaming under studio lights",
    quality: 'quality',
    duration: 5,
    fps: 30
  });

  console.log('Richard Mille task:', task.id);
  
  let result = await zai.async.result.query(task.id);
  let pollCount = 0;
  
  while (result.task_status === 'PROCESSING' && pollCount < 120) {
    pollCount++;
    await new Promise(r => setTimeout(r, 5000));
    result = await zai.async.result.query(task.id);
    console.log(`Richard Mille: ${pollCount}/120 - ${result.task_status}`);
  }

  const url = (result as any).video_result?.[0]?.url;
  console.log('Richard Mille URL:', url);
  fs.writeFileSync('/home/z/my-project/download/video_richard_mille.txt', url || 'failed');
  return url;
}

video1();
