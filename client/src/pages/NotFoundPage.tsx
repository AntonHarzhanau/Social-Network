import { Button } from "@/shared/components/ui/button"
import { Link } from "react-router"

const NotFoundPage = () => {
  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
        <Button asChild>
            <Link to="/">Go to Home</Link>
        </Button>
    </div>
  )
}

export default NotFoundPage
export const Component = NotFoundPage
