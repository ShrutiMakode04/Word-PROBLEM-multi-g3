import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY || 'sk_0af55b573c54fe31387443150c45624fed865ccc914cd486';
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice voice ID
const AUDIO_DIR = path.join(process.cwd(), 'public', 'assets', 'audio');

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

const AUDIO_LINES = {
  'welcome_start': "Welcome to the magical world of Word Problems! Get ready for an amazing party-planning adventure with Emma. Let's start learning!",
  'welcome_quest': "Begin your quest!",
  'wonder_intro': "Have you ever wondered how to find the total of many items quickly? Emma wants to buy 4 boxes with 6 cupcakes each. Instead of counting 1, 2, 3... 24, we can use the magic shortcut! But there's an even faster way called Multiplication! 4 times 6 equals 24. I'm Emma! Multiplication helps us solve real-world problems so much faster!",
  'story_1': "Emma is preparing for a big party, and needs to buy boxes of cupcakes. She wants to know exactly, how many she will have!",
  'story_2': "She goes to the bakery, and buys 4 brightly colored boxes. Each box has exactly, 6 delicious cupcakes inside.",
  'story_3': "Counting them one by one, takes too long! She gets confused, trying to count all 24 cupcakes on her fingers.",
  'story_4': "Then she remembers, the magic shortcut: Multiplication! 4 boxes of 6 cupcakes, means 4 times 6.",
  'story_5': "By multiplying, she quickly finds the total is 24 cupcakes! Multiplication, makes solving word problems, so much faster.",
  
  // 15 simulation variations
  'sim_intro_1_1': "Emma is packing 2 boxes. Drag 3 cupcakes into each box!",
  'sim_intro_1_2': "Emma is packing 3 boxes. Drag 4 cupcakes into each box!",
  'sim_intro_1_3': "Emma is packing 4 boxes. Drag 2 cupcakes into each box!",
  'sim_intro_2_1': "John is building a bridge with 3 planks. Each plank is 5 meters long. Drag the slider to add planks!",
  'sim_intro_2_2': "John is building a bridge with 4 planks. Each plank is 4 meters long. Drag the slider to add planks!",
  'sim_intro_2_3': "John is building a bridge with 5 planks. Each plank is 2 meters long. Drag the slider to add planks!",
  'sim_intro_3_1': "Drag the stamp to the paper to add a group of 3 stars! Do this 3 times.",
  'sim_intro_3_2': "Drag the stamp to the paper to add a group of 5 stars! Do this 4 times.",
  'sim_intro_3_3': "Drag the stamp to the paper to add a group of 6 stars! Do this 2 times.",
  'sim_intro_4_1': "A melon weighs 2 units. A golden melon weighs 3 times as much. Drag 2-unit weights to balance it!",
  'sim_intro_4_2': "A melon weighs 3 units. A golden melon weighs 4 times as much. Drag 3-unit weights to balance it!",
  'sim_intro_4_3': "A melon weighs 5 units. A golden melon weighs 2 times as much. Drag 5-unit weights to balance it!",
  'sim_intro_5_1': "Connect 3 train cars. Each car is 4 meters long! Drag the car to the track.",
  'sim_intro_5_2': "Connect 4 train cars. Each car is 2 meters long! Drag the car to the track.",
  'sim_intro_5_3': "Connect 5 train cars. Each car is 3 meters long! Drag the car to the track.",

  'very_good': "Very good!",
  'incorrect': "Incorrect.",
  'play_intro': "Time to practice! Let's solve these word problems.",
  'reflect_certificate': "Congratulations! You are a Word Problem Master!"
};

async function generateAudio(filename, text) {
  const filepath = path.join(AUDIO_DIR, `${filename}.mp3`);
  if (fs.existsSync(filepath)) {
    console.log(`[SKIP] ${filename}.mp3 already exists.`);
    return;
  }
  console.log(`[GENERATING] ${filename}.mp3...`);
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    console.log(`[SUCCESS] Saved ${filename}.mp3`);
  } catch (err) {
    console.error(`[FAILED] Failed to generate ${filename}:`, err.message);
  }
}

async function run() {
  console.log("Starting ElevenLabs audio generation...");
  
  // Clean up any old files we are explicitly overriding
  const oldFiles = [
    'sim_intro_1', 'sim_intro_2', 'sim_intro_3', 'sim_intro_4', 'sim_intro_5'
  ];
  oldFiles.forEach(f => {
    const fp = path.join(AUDIO_DIR, `${f}.mp3`);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  });

  const entries = Object.entries(AUDIO_LINES);
  for (let i = 0; i < entries.length; i++) {
    const [filename, text] = entries[i];
    // Force regeneration if it's one of the sim_intro files
    if (filename.startsWith('sim_intro')) {
        const fp = path.join(AUDIO_DIR, `${filename}.mp3`);
        if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    await generateAudio(filename, text);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  console.log("Audio generation complete!");
}

run();
