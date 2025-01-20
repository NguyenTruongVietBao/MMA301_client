import MusicLogo from "../assets/images/logo-music-1.png";
import DanceLogo from "../assets/images/logo-music-2.png";
import CodeLogo from "../assets/images/logo-music-3.png";

const sampleDataCourse = {
  courses: [
    {
      id: "101",
      title: "React Native for Beginners",
      description: "Learn the basics of React Native.",
      imageUrl: MusicLogo,
      categoryId: "1",
      price: 500,
      chapters: [
        {
          id: "c1",
          title: "Introduction to React Native",
          lessons: [
            {
              id: "l1",
              title: "Setting up the Development Environment",
              urlVideo: "https://example.com/lesson1.mp4",
            },
            {
              id: "l2",
              title: "Your First React Native App",
              urlVideo: "https://example.com/lesson2.mp4",
            },
          ],
        },
        {
          id: "c2",
          title: "Components and Styling",
          lessons: [
            {
              id: "l3",
              title: "Understanding Components",
              urlVideo: "https://example.com/lesson3.mp4",
            },
            {
              id: "l4",
              title: "Applying Styles in React Native",
              urlVideo: "https://example.com/lesson4.mp4",
            },
          ],
        },
      ],
    },
    {
      id: "102",
      title: "Advanced React Native",
      description: "Deep dive into React Native development.",
      imageUrl: MusicLogo,
      categoryId: "1",
      price: 500,
      chapters: [
        {
          id: "c3",
          title: "Navigation in React Native",
          lessons: [
            {
              id: "l5",
              title: "Introduction to React Navigation",
              urlVideo: "https://example.com/lesson5.mp4",
            },
            {
              id: "l6",
              title: "Stack Navigation",
              urlVideo: "https://example.com/lesson6.mp4",
            },
          ],
        },
        {
          id: "c4",
          title: "State Management in React Native",
          lessons: [
            {
              id: "l7",
              title: "Using Context API",
              urlVideo: "https://example.com/lesson7.mp4",
            },
            {
              id: "l8",
              title: "Using Redux in React Native",
              urlVideo: "https://example.com/lesson8.mp4",
            },
          ],
        },
      ],
    },
    {
      id: "103",
      title: "Advanced React Native",
      description: "Deep dive into React Native development.",
      imageUrl: MusicLogo,
      categoryId: "1",
      price: 500,
      chapters: [
        {
          id: "c5",
          title: "Performance Optimization",
          lessons: [
            {
              id: "l9",
              title: "Optimizing Render Cycles",
              urlVideo: "https://example.com/lesson9.mp4",
            },
            {
              id: "l10",
              title: "Using Hermes for Faster Performance",
              urlVideo: "https://example.com/lesson10.mp4",
            },
          ],
        },
        {
          id: "c6",
          title: "React Native Testing",
          lessons: [
            {
              id: "l11",
              title: "Unit Testing with Jest",
              urlVideo: "https://example.com/lesson11.mp4",
            },
            {
              id: "l12",
              title: "E2E Testing with Detox",
              urlVideo: "https://example.com/lesson12.mp4",
            },
          ],
        },
      ],
    },
    {
      id: "104",
      title: "UI/UX Design Basics",
      description: "Introduction to UI/UX design.",
      imageUrl: MusicLogo,
      categoryId: "2",
      chapters: [
        {
          id: "c7",
          title: "Introduction to UI Design",
          lessons: [
            {
              id: "l13",
              title: "Understanding User Interface",
              urlVideo: "https://example.com/lesson13.mp4",
            },
            {
              id: "l14",
              title: "Design Principles",
              urlVideo: "https://example.com/lesson14.mp4",
            },
          ],
        },
        {
          id: "c8",
          title: "UX Design Basics",
          lessons: [
            {
              id: "l15",
              title: "User Research Techniques",
              urlVideo: "https://example.com/lesson15.mp4",
            },
            {
              id: "l16",
              title: "Prototyping with Figma",
              urlVideo: "https://example.com/lesson16.mp4",
            },
          ],
        },
      ],
    },
    {
      id: "201",
      title: "UI/UX Design Basics",
      description: "Introduction to UI/UX design.",
      imageUrl: MusicLogo,
      categoryId: "2",
      chapters: [
        {
          id: "c9",
          title: "Understanding Color Theory",
          lessons: [
            {
              id: "l17",
              title: "Basic Color Theory",
              urlVideo: "https://example.com/lesson17.mp4",
            },
            {
              id: "l18",
              title: "Applying Color to UI Design",
              urlVideo: "https://example.com/lesson18.mp4",
            },
          ],
        },
        {
          id: "c10",
          title: "Typography for UI",
          lessons: [
            {
              id: "l19",
              title: "Choosing the Right Typeface",
              urlVideo: "https://example.com/lesson19.mp4",
            },
            {
              id: "l20",
              title: "Creating Hierarchy with Typography",
              urlVideo: "https://example.com/lesson20.mp4",
            },
          ],
        },
      ],
    },
  ],
  categories: [
    { id: 1, categoryName: "Music", imageUrl: MusicLogo },
    { id: 2, categoryName: "Dance", imageUrl: DanceLogo },
    { id: 3, categoryName: "Code", imageUrl: CodeLogo },
  ],
};

export default sampleDataCourse;
