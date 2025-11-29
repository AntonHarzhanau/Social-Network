import { fetchPosts} from "@/shared/api/post";
import { Button } from "@/shared/components/ui/button";
import FeedCard from "@/widgets/FeedCard";
import { useQuery } from "@tanstack/react-query";



const FeedsPage = () => {

  const {data, isPending, isError} = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });


  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading posts.</div>;
  }

  return (
    <div className="flex gap-2 p-2">
      <div className="flex flex-col flex-5">
       {data && data.map((post) => (
        <FeedCard key={post.id} post={post} />
       ))}    

      </div>

      <aside className="flex-3 flex flex-col gap-2 h-fit rounded-xl bg-card sticky top-14 p-2">
        <Button variant="ghost" className="w-full justify-start">
          All
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          Friends
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          Groups
        </Button>
      </aside>
    </div>
  );
};

export default FeedsPage;
