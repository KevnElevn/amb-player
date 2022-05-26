export const Beach = {
  ambId: 2,
  ambData: [
    {
      groupName: "Ocean",
      groupId: 1,
      interval: { from: 0, to: 0 },
      sounds: [
        {
          name: "Waves",
          id: 1,
          url: "https://www.youtube.com/watch?v=UYh7mlW1A9c",
          volume: 50,
          start: 8,
          end: 36,
          chain: { from: 0, to: 0},
        }
      ]
    },
    {
      groupName: "Seagulls",
      groupId: 2,
      interval: { from: 5, to: 30 },
      sounds: [
        {
          name: "Seagull 1",
          id: 1,
          url: "https://www.youtube.com/watch?v=UYh7mlW1A9c",
          volume: 100,
          start: 0,
          end: 2,
          chain: { from: 0, to: 2},
        },
        {
          name: "Seagull 2",
          id: 2,
          url: "https://www.youtube.com/watch?v=UYh7mlW1A9c",
          volume: 100,
          start: 4,
          end: 5,
          chain: { from: 0, to: 2},
        },
        {
          name: "Seagull 3",
          id: 3,
          url: "https://www.youtube.com/watch?v=UYh7mlW1A9c",
          volume: 100,
          start: 6,
          end: 7,
          chain: { from: 0, to: 2},
        },
      ]
    },
    {
      groupName: "Footsteps",
      groupId: 3,
      interval: { from: 30, to: 180 },
      sounds: [
        {
          name: "Steps",
          id: 1,
          url: "https://www.youtube.com/watch?v=UYh7mlW1A9c",
          volume: 100,
          start: 38,
          end: 39,
          chain: { from: 3, to: 6 },
        }
      ]
    },
    {
      groupName: "BGM",
      groupId: 4,
      interval: { from: 60, to: 300 },
      sounds: [
        {
          name: "Summer (Nature's Crescendo)",
          id: 1,
          url: "https://www.youtube.com/watch?v=k0nqXeM-sns",
          volume: 100,
          start: 0,
          end: -1,
          chain: { from: 0, to: 0 },
        },
        {
          name: "Summer (Tropicala)",
          id: 2,
          url: "https://www.youtube.com/watch?v=n7sDUAALYSM",
          volume: 100,
          start: 0,
          end: -1,
          chain: { from: 0, to: 0 },
        },
        {
          name: "Summer (The Sun Can Bend An Orange Sky)",
          id: 3,
          url: "https://www.youtube.com/watch?v=C-84hnlrbys",
          volume: 100,
          start: 0,
          end: -1,
          chain: { from: 0, to: 0 },
        },
      ]
    },
  ]
}
