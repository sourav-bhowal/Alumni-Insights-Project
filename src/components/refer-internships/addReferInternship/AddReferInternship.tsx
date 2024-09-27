import {
  CreateReferInternshipSchemaType,
  createReferInternshipSchema,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateReferInternshipMutation } from "./mutations";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

// Interface for Add Refer Job Props
interface AddReferInternshipProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Add Refer Job Component
export default function AddReferInternshipDialog({
  open,
  onOpenChange,
}: AddReferInternshipProps) {
  // Form
  const form = useForm<CreateReferInternshipSchemaType>({
    resolver: zodResolver(createReferInternshipSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      skills: "",
      category: "",
      stipend: 0,
      applyLink: "",
      workType: "onsite",
    },
  });

  // Submit mutation
  const mutation = useCreateReferInternshipMutation();

  // On Submit
  async function onSubmit(values: CreateReferInternshipSchemaType) {
    console.log(values);
    // Call mutation
    mutation.mutate(values, {
      onSuccess: () => {
        // Close dialog
        onOpenChange(false);
        // Reset form
        form.reset();
      },
    });
  }

  // JSX
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Refer Job</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the title of the job"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <FormControl>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            {...field}
                            value={"onsite"}
                            onChange={() => form.setValue("workType", "onsite")}
                            checked={form.getValues("workType") === "onsite"}
                          />
                          <span>On-Site</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            {...field}
                            value={"remote"}
                            onChange={() => form.setValue("workType", "remote")}
                            checked={form.getValues("workType") === "remote"}
                          />
                          <span>Remote</span>
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the location of the job"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the skills required for the job. Eg: React, Node.js"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the category of the job. Eg: Full Time, Part Time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stipend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter the stipend of the internship"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="applyLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apply Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the apply link of the job"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">
                  {mutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
