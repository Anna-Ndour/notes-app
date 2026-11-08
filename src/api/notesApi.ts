export interface SamplePost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const fetchSampleNotesApi = async (): Promise<
  { title: string; body: string }[]
> => {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=5'
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch sample notes (Status: ${response.status})`);
  }

  const posts: SamplePost[] = await response.json();
  return posts.map((post) => ({
    title: post.title,
    body: post.body,
  }));
};
