import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateRsvp, useGetRsvpStats, RsvpAttendanceStatus } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { SiWhatsapp } from 'react-icons/si';
import { Phone } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import type { ContactInfo } from '@workspace/api-client-react';

const rsvpSchema = z.object({
  guestName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  phone: z.string().optional(),
  numberOfGuests: z.coerce.number().min(1).optional(),
  attendanceStatus: z.enum([RsvpAttendanceStatus.attending, RsvpAttendanceStatus.not_sure, RsvpAttendanceStatus.not_attending]),
  needsTravelHelp: z.boolean().default(false),
  message: z.string().optional(),
});

type RsvpFormValues = z.infer<typeof rsvpSchema>;

interface RsvpSectionProps {
  contacts: ContactInfo[];
}

export function RsvpSection({ contacts }: RsvpSectionProps) {
  const { toast } = useToast();
  const createRsvp = useCreateRsvp();
  const { data: stats } = useGetRsvpStats();

  const params = new URLSearchParams(window.location.search);
  const guestNameParam = params.get('guest') ?? '';

  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      guestName: guestNameParam,
      email: "",
      phone: "",
      numberOfGuests: 1,
      attendanceStatus: RsvpAttendanceStatus.attending,
      needsTravelHelp: false,
      message: "",
    },
  });

  const onSubmit = (data: RsvpFormValues) => {
    createRsvp.mutate({ data }, {
      onSuccess: () => {
        toast({
          title: "Thank you!",
          description: "We can't wait to see you in Udaipur.",
          className: "bg-primary text-primary-foreground border-none font-serif text-lg",
        });
        form.reset();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not submit RSVP. Please try again.",
        });
      }
    });
  };

  return (
    <section id="rsvp" className="py-32 px-6 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1605335198059-e9329979d34d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-5 mix-blend-overlay pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* RSVP Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border p-8 md:p-12"
          >
            <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-4 block">Join Us</span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-2">RSVP</h2>
            {stats && (
              <p className="text-muted-foreground font-light mb-8">
                Join {stats.attending} guests who have already confirmed!
              </p>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 uppercase tracking-wider text-xs">Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} className="bg-background border-border focus-visible:ring-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 uppercase tracking-wider text-xs">Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} className="bg-background border-border focus-visible:ring-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 uppercase tracking-wider text-xs">Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 234 567 8900" {...field} className="bg-background border-border focus-visible:ring-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="attendanceStatus"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-foreground/80 uppercase tracking-wider text-xs">Will you attend?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={RsvpAttendanceStatus.attending} className="text-primary border-primary" />
                            </FormControl>
                            <FormLabel className="font-normal font-serif text-lg">Joyfully Accepts</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={RsvpAttendanceStatus.not_sure} className="text-primary border-primary" />
                            </FormControl>
                            <FormLabel className="font-normal font-serif text-lg">Not Sure Yet</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={RsvpAttendanceStatus.not_attending} className="text-primary border-primary" />
                            </FormControl>
                            <FormLabel className="font-normal font-serif text-lg">Regretfully Declines</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <FormField
                    control={form.control}
                    name="numberOfGuests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 uppercase tracking-wider text-xs">Number of Guests (including you)</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} className="bg-background border-border focus-visible:ring-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="needsTravelHelp"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-border bg-background h-10 items-center">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">
                            Need travel assistance?
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 uppercase tracking-wider text-xs">Message for the couple</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any dietary requirements or just say hello..." 
                          className="resize-none bg-background border-border focus-visible:ring-primary min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={createRsvp.isPending}
                  className="w-full py-6 font-serif tracking-widest uppercase text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-none mt-4"
                >
                  {createRsvp.isPending ? "Sending..." : "Submit RSVP"}
                </Button>
              </form>
            </Form>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-4 block">Get in Touch</span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-12">Contact Us</h2>
            
            <div className="space-y-6">
              {contacts.map((contact, index) => (
                <div key={index} className="bg-card border border-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 transition-colors">
                  <div>
                    <h3 className="font-serif text-2xl mb-1">{contact.name}</h3>
                    <p className="text-primary text-sm uppercase tracking-widest">{contact.relation}</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="rounded-full border-border hover:border-primary hover:text-primary w-12 h-12"
                      asChild
                    >
                      <a href={`tel:${contact.phone}`}>
                        <Phone size={20} />
                      </a>
                    </Button>
                    
                    {contact.whatsappUrl && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="rounded-full border-border hover:border-primary hover:bg-primary/10 text-[#25D366] hover:text-[#25D366] w-12 h-12"
                        asChild
                      >
                        <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer">
                          <SiWhatsapp size={20} />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center text-muted-foreground font-light border-t border-border/50 pt-8">
              <p>We look forward to celebrating with you.</p>
              <p className="mt-2 font-serif text-2xl text-primary">#PriyaWedsArjun</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}