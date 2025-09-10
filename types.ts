
export enum Language {
  FR = 'fr',
  EN = 'en',
  AR = 'ar',
}

export interface QCM {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface DragDrop {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface WordScramble {
  scrambled: string;
  correct: string;
  hint: string;
}

export interface StoryContent {
  title: string;
  storyText: string[];
  qcm: QCM[];
  dragDrop: DragDrop[];
  wordScramble: WordScramble[];
}

export interface TeacherResourcesContent {
    discussionPrompts: string[];
}

export interface Story {
  id: string;
  image: string;
  content: {
    [key in Language]: StoryContent;
  };
  teacherResources: {
    [key in Language]: TeacherResourcesContent;
  };
  technicalInfo: {
    robotInfo: { [key: string]: string };
    videoUrl: string;
    coloringImage: string;
  };
}
