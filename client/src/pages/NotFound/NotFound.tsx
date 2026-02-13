import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  return (
    <div className="flex min-h-full items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="flex flex-col gap-6 py-10">
          <h1 className="text-6xl font-bold text-primary">404</h1>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Page not found</h2>
            <p className="text-sm text-muted-foreground">
              Sorry, the page you are looking for doesn’t exist or has been
              moved.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
