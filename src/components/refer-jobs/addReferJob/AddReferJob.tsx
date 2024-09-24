import {
  CreateReferJobSchemaType,
  createReferJobSchema,
} from "@/lib/validations";
import { ReferJobData } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateReferJobMutation } from "./mutations";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// Interface for Add Refer Job Props
interface AddReferJobProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Add Refer Job Component
export default function AddReferJobDialog({
  open,
  onOpenChange,
}: AddReferJobProps) {
  // Form
  const form = useForm<CreateReferJobSchemaType>({
    resolver: zodResolver(createReferJobSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      skills: "",
      category: "",
      salary: "",
      applyLink: "",
      jobType: "onsite",
      workType: "full-time",
    },
  });

  // Submit mutation
  const mutation = useCreateReferJobMutation();

  // On Submit
  async function onSubmit(values: CreateReferJobSchemaType) {
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
                name="jobType"
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
                            onChange={() => form.setValue("jobType", "onsite")}
                            checked={form.getValues("jobType") === "onsite"}
                          />
                          <span>On-Site</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            {...field}
                            value={"remote"}
                            onChange={() => form.setValue("jobType", "remote")}
                            checked={form.getValues("jobType") === "remote"}
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
                name="workType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Type</FormLabel>
                    <FormControl>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            {...field}
                            value={"full-time"}
                            onChange={() => form.setValue("workType", "full-time")}
                            checked={form.getValues("workType") === "full-time"}
                          />
                          <span>Full-time</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            {...field}
                            value={"part-time"}
                            onChange={() => form.setValue("workType", "part-time")}
                            checked={form.getValues("workType") === "part-time"}
                          />
                          <span>Part-time</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            {...field}
                            value={"contract"}
                            onChange={() => form.setValue("workType", "contract")}
                            checked={form.getValues("workType") === "contract"}
                          />
                          <span>Contract</span>
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
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the salary of the job"
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
