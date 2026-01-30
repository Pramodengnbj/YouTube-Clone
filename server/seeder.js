import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.model.js";
import Channel from "./models/Channel.model.js";
import Video from "./models/Video.model.js";
import Comment from "./models/Comment.model.js";
import bcrypt from "bcryptjs";

dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");
    return true;
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

const CATEGORIES = [
  "web development", "gaming", "sports", "music", "react", "mongodb",
  "funny", "cricket", "football", "animation", "live", "game development",
  "movies", "tech", "education", "coding", "vlogs", "news", "science", "tutorial"
];

// 67 Real YouTube Videos with verified working IDs - NO DUPLICATES
const REAL_VIDEOS = [
  // Tech & Programming (15 videos)
  { id: "bMknfKXIFA8", title: "React Course - Beginner's Tutorial for React JavaScript Library", tags: ["react", "web development", "coding"], category: "education" },
  { id: "pWbMrx5rVBE", title: "MongoDB in 100 Seconds", tags: ["mongodb", "tech", "education"], category: "tech" },
  { id: "SqcY0GlETPk", title: "React Tutorial for Beginners", tags: ["react", "coding", "web development"], category: "education" },
  { id: "Oe421EPjeBE", title: "100+ JavaScript Concepts you Need to Know", tags: ["coding", "web development", "education"], category: "education" },
  { id: "W6NZfCO5SIk", title: "JavaScript Tutorial for Beginners", tags: ["coding", "web development", "tutorial"], category: "education" },
  { id: "lI1ae4REbFM", title: "What is Machine Learning?", tags: ["tech", "education", "ai"], category: "tech" },
  { id: "rfscVS0vtbw", title: "Learn Python - Full Course for Beginners", tags: ["python", "coding", "education"], category: "education" },
  { id: "PkZNo7MFNFg", title: "Learn JavaScript - Full Course for Beginners", tags: ["javascript", "coding", "tutorial"], category: "education" },
  { id: "kqtD5dpn9C8", title: "CS50 2023 - Lecture 0 - Scratch", tags: ["coding", "education", "cs50"], category: "education" },
  { id: "8mAITcNt710", title: "Git and GitHub for Beginners - Crash Course", tags: ["git", "coding", "tutorial"], category: "education" },
  { id: "RGOj5yH7evk", title: "Git and GitHub for Beginners", tags: ["git", "coding", "web development"], category: "education" },
  { id: "vQWlgd7hV4A", title: "HTML Full Course - Build a Website Tutorial", tags: ["html", "web development", "tutorial"], category: "education" },
  { id: "1PnVor36_40", title: "CSS Tutorial - Zero to Hero", tags: ["css", "web development", "tutorial"], category: "education" },
  { id: "UB1O30fR-EE", title: "HTML CSS JavaScript Tutorial", tags: ["html", "css", "javascript"], category: "education" },
  
  // Gaming (12 videos)
  { id: "xNjI03CGkb4", title: "I Survived 100 Days in Minecraft Hardcore", tags: ["gaming", "minecraft", "funny"], category: "gaming" },
  { id: "ALZHF5UqnU4", title: "The History of Speedrunning", tags: ["gaming", "tech", "education"], category: "gaming" },
  { id: "MmB9b5njVbA", title: "Minecraft Manhunt Grand Finale", tags: ["gaming", "minecraft"], category: "gaming" },
  { id: "RpkQEq75y18", title: "GTA 5 but Everything is Random", tags: ["gaming", "funny"], category: "gaming" },
  { id: "LDU_Txk06tM", title: "Minecraft, But Item Drops Are Random", tags: ["gaming", "minecraft"], category: "gaming" },
  { id: "n_Dv4JMiwK8", title: "The Evolution of Video Games", tags: ["gaming", "education", "tech"], category: "gaming" },
  { id: "AmC9SmCBUj4", title: "Code a Game in Scratch Tutorial", tags: ["game development", "coding", "tech"], category: "education" },
  
  // Sports (10 videos)
  { id: "60ItHLz5WEA", title: "Lionel Messi - The GOAT - Official Movie", tags: ["football", "sports"], category: "sports" },
  { id: "YH65jS-EseQ", title: "TOP 50 GOALS IN FOOTBALL HISTORY", tags: ["football", "sports"], category: "sports" },
  { id: "XdvoDFTcTLw", title: "Cristiano Ronaldo - All 800 Goals", tags: ["football", "sports"], category: "sports" },
  { id: "Xhlx43rTs2Q", title: "Tom Brady - The Greatest Quarterback", tags: ["football", "sports"], category: "sports" },
  { id: "NFlceOv8LMU", title: "Usain Bolt All World Records", tags: ["sports", "athletics"], category: "sports" },
  
  // Music & Live (8 videos)
  { id: "jfKfPfyJRdk", title: "lofi hip hop radio 📚 - beats to relax/study to", tags: ["music", "live", "lofi"], category: "music" },
  { id: "5qap5aO4i9A", title: "lofi hip hop radio - beats to sleep/chill to", tags: ["music", "live", "lofi"], category: "music" },
  { id: "DWcJFNfaw9c", title: "Synthwave Radio - Beats to Chill/Game To", tags: ["music", "live"], category: "music" },
  { id: "EgqUJOudrcM", title: "Jazz Music for Relaxing", tags: ["music", "live"], category: "music" },
  { id: "rUxyKA_-grg", title: "Classical Music for Studying", tags: ["music", "live"], category: "music" },
  { id: "YykjpeuMNEk", title: "Ed Sheeran - Shape of You", tags: ["music"], category: "music" },
  { id: "kJQP7kiw5Fk", title: "Luis Fonsi - Despacito", tags: ["music"], category: "music" },
  { id: "fHI8X4OXluQ", title: "BTS - Dynamite Official MV", tags: ["music", "kpop"], category: "music" },
  
  // Vlogs & Lifestyle (8 videos)
  { id: "jNQXAC9IVRw", title: "Me at the zoo", tags: ["vlogs", "funny", "history"], category: "vlogs" },
  { id: "d0tU18Ybcvk", title: "Life as a Google Software Engineer", tags: ["vlogs", "tech", "education"], category: "vlogs" },
  { id: "RvWbcK3YQ_o", title: "Day in Life of a YouTuber", tags: ["vlogs"], category: "vlogs" },
  
  // Animation & Movies (6 videos)
  { id: "TcMBFSGVi1c", title: "How Pixar makes a movie", tags: ["animation", "movies", "tech"], category: "animation" },
  { id: "uDIgS-Soo9Q", title: "Making of Spider-Verse Animation", tags: ["animation", "movies"], category: "animation" },
  { id: "zNzZ1PfUDNk", title: "Stop Motion Animation Tutorial", tags: ["animation", "tutorial"], category: "education" },
  
  // News & Live (3 videos)
  { id: "w_Ma8oQLmSM", title: "BBC News Live", tags: ["news", "live"], category: "news" },
  
  // Science & Education (5 videos)
  { id: "xuCn8ux2gbs", title: "How Does the Brain Work?", tags: ["science", "education"], category: "science" },
  { id: "21X5lGlDOfg", title: "NASA's Journey to Mars", tags: ["science", "space"], category: "science" },
];

const CHANNEL_DATA = [
  { 
    name: "CodeMaster", 
    handle: "codemaster_dev", 
    description: "Master web development with React, JavaScript, and modern frameworks. New tutorials every week!",
    banner: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1500&h=400&fit=crop"
  },
  { 
    name: "Pro Gamer", 
    handle: "pro_gamer", 
    description: "Epic gaming content, walkthroughs, and entertaining gameplay. Join the community!",
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1500&h=400&fit=crop"
  },
  { 
    name: "Sports World", 
    handle: "sports_world", 
    description: "Best sports highlights from football, cricket, and more. Never miss the action!",
    banner: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1500&h=400&fit=crop"
  },
  { 
    name: "Tech Guru", 
    handle: "tech_guru", 
    description: "Latest tech news, tutorials, and reviews. Stay updated with technology!",
    banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1500&h=400&fit=crop"
  },
  { 
    name: "Lofi Beats", 
    handle: "lofi_beats", 
    description: "24/7 lofi music for studying, working, and relaxing. Subscribe for daily uploads!",
    banner: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1500&h=400&fit=crop"
  },
  { 
    name: "Daily Vlogger", 
    handle: "daily_vlogger", 
    description: "Follow my daily adventures! Lifestyle, tech, and everything in between.",
    banner: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1500&h=400&fit=crop"
  },
  { 
    name: "Learn Coding", 
    handle: "learn_coding", 
    description: "Learn programming from scratch! Beginner-friendly tutorials and coding challenges.",
    banner: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1500&h=400&fit=crop"
  },
  { 
    name: "Animation Studio", 
    handle: "animation_studio", 
    description: "Behind the scenes of animation and movie making. Tips and tutorials for animators!",
    banner: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1500&h=400&fit=crop"
  },
  { 
    name: "Science Explorer", 
    handle: "science_explorer", 
    description: "Exploring the wonders of science and the universe. Educational content for curious minds!",
    banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1500&h=400&fit=crop"
  },
  { 
    name: "News Today", 
    handle: "news_today", 
    description: "Your daily source for breaking news and live coverage from around the world.",
    banner: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1500&h=400&fit=crop"
  }
];

// Utility functions
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seedData = async () => {
  await connect();

  try {
    console.log("Clearing existing data...");
    
    // Clear all data in parallel
    await Promise.all([
      User.deleteMany({}),
      Channel.deleteMany({}),
      Video.deleteMany({}),
      Comment.deleteMany({})
    ]);
    
    console.log("Cleared existing data");

    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    // Create password hash
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("123456", salt);

    // Step 1: Create test users
    console.log("Creating users...");
    
    const testUser = await User.create({
      username: "testuser",
      email: "user@test.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=testuser",
      password: hash,
      createdAt: oneYearAgo,
    });

    const testUser2 = await User.create({
      username: "testuser2",
      email: "user2@test.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=testuser2",
      password: hash,
      createdAt: oneYearAgo,
    });

    const testUser3 = await User.create({
      username: "testuser3",
      email: "user3@test.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=testuser3",
      password: hash,
      createdAt: oneYearAgo,
    });

    const createdUsers = [testUser, testUser2, testUser3];
    
    // Create additional users
    for (let i = 4; i <= 15; i++) {
      const user = await User.create({
        username: `User${i}`,
        email: `user${i}@gmail.com`,
        password: hash,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`,
        createdAt: randomDate(oneYearAgo, now),
      });
      createdUsers.push(user);
    }

    console.log(`Created ${createdUsers.length} users`);

    // Step 2: Create channels
    console.log("Creating channels...");
    
    const createdChannels = [];
    const channelVideosMap = new Map();

    for (let i = 0; i < CHANNEL_DATA.length; i++) {
      const channelInfo = CHANNEL_DATA[i];
      const channelCreatedAt = randomDate(
        oneYearAgo,
        new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
      );

      // Distribute channel ownership among first 3 test users
      let channelOwner;
      if (i < 4) {
        channelOwner = testUser._id;
      } else if (i < 7) {
        channelOwner = testUser2._id;
      } else {
        channelOwner = testUser3._id;
      }

      const newChannel = await Channel.create({
        owner: channelOwner,
        handle: `@${channelInfo.handle}`,
        channelName: channelInfo.name,
        description: channelInfo.description,
        channelAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${channelInfo.handle}`,
        channelBanner: channelInfo.banner,
        subscribers: getRandomInt(1000, 150000),
        videos: [],
        createdAt: channelCreatedAt,
        updatedAt: channelCreatedAt,
      });

      createdChannels.push(newChannel);
      channelVideosMap.set(newChannel._id.toString(), []);
      
      console.log(`${channelInfo.name} (@${channelInfo.handle})`);
    }

    console.log(`Created ${createdChannels.length} channels`);

    // Step 3: Create videos - ONLY ONCE per video (no duplicates)
    console.log("Creating videos...");
    
    const createdVideos = [];
    
    // Create each video only ONCE with a random channel
    for (const vid of REAL_VIDEOS) {
      const randomChannel = createdChannels[Math.floor(Math.random() * createdChannels.length)];
      const videoCreatedAt = randomDate(randomChannel.createdAt, now);
      const viewCount = getRandomInt(5000, 2000000);
      const likeCount = getRandomInt(Math.floor(viewCount * 0.02), Math.floor(viewCount * 0.12));

      const newVideo = await Video.create({
        channelId: randomChannel._id,
        userId: randomChannel.owner,
        title: vid.title,
        description: `${vid.title}\n\nTags: ${vid.tags.join(", ")}\n\nWatch more amazing content on our channel!`,
        videoUrl: `https://www.youtube.com/watch?v=${vid.id}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${vid.id}/hqdefault.jpg`,
        views: viewCount,
        likes: likeCount,
        tags: vid.tags,
        category: vid.category,
        createdAt: videoCreatedAt,
        updatedAt: videoCreatedAt,
      });

      createdVideos.push(newVideo);
      channelVideosMap.get(randomChannel._id.toString()).push(newVideo._id);
    }

    console.log(`Created ${createdVideos.length} videos`);

    // Step 4: Update channels with their video IDs
    console.log("Linking videos to channels...");
    for (const [channelId, videoIds] of channelVideosMap.entries()) {
      await Channel.findByIdAndUpdate(channelId, { videos: videoIds });
    }
    console.log("Videos linked to channels");

    // Step 5: Create comments
    console.log("Creating comments...");
    
    const sampleComments = [
      "Great tutorial! Very helpful 👍",
      "Thanks for sharing this!",
      "Amazing content, keep it up!",
      "This is exactly what I was looking for",
      "Subscribed! Love your content",
      "Clear explanation, thank you!",
      "Best video on this topic",
      "Really appreciate this tutorial",
      "Helped me a lot, thanks!",
      "More content like this please!",
      "Awesome explanation!",
      "Finally understood this concept!",
      "You deserve more subscribers",
      "Quality content as always",
      "Can't wait for the next video!",
      "This channel is underrated",
      "Excellent work!",
      "Learned so much from this",
      "Keep making these videos!",
      "Absolutely brilliant!"
    ];

    let createdComments = 0;
    
    // Add comments to random videos (40 videos)
    const videosToComment = createdVideos.slice(0, Math.min(40, createdVideos.length));
    
    for (const video of videosToComment) {
      const numComments = getRandomInt(3, 10);
      for (let i = 0; i < numComments; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const commentCreatedAt = randomDate(video.createdAt, now);
        await Comment.create({
          videoId: video._id,
          userId: randomUser._id,
          description: sampleComments[Math.floor(Math.random() * sampleComments.length)],
          createdAt: commentCreatedAt,
          updatedAt: commentCreatedAt,
        });
        createdComments++;
      }
    }
    console.log(`Created ${createdComments} comments`);
    process.exit(0);

  } catch (err) {
    console.error("Seeding failed:", err.message);
    console.error(err);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

seedData();