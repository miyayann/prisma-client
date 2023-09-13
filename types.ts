export interface Profile {
  id : number;
  bio: string;
  profileImageUrl: string;
  userId: number;
  user: UserType;
}


export interface UserType {
  id : number;
  username: string;
  email: string;
  password: string;
  posts: PostTypes[];
  profile: Profile;
}

export interface PostTypes {
  id : number;
  content: string;
  createdAt: string;
  authorId: number;
  author: UserType;
  likes: {
    isLiked: boolean; 
  }[];
}