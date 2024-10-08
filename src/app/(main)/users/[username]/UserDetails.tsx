import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProjects from "./UserProjects";

// UserDetails component
export default async function UserDetails() {
  return (
    <main className="w-full">
      <Tabs defaultValue="projects">
        <TabsList className="flex w-full bg-card">
          <TabsTrigger value="projects" className="flex-1 text-center">
            Projects
          </TabsTrigger>
          <TabsTrigger value="internships" className="flex-1 text-center">
            Internships
          </TabsTrigger>
          <TabsTrigger value="researchPapers" className="flex-1 text-center">
            Research Papers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <UserProjects />
        </TabsContent>
        <TabsContent value="internships">
          <div>My Internships</div>
        </TabsContent>
        <TabsContent value="researchPapers">
          <div>My Papers</div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
