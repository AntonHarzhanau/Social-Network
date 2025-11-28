import type { Post } from "@/shared/api/post";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";

const FeedsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  // useEffect(() => {

  // }, [])
  return (
    <div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            
          </CardTitle>
          <CardContent></CardContent>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>

        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FeedsPage;
