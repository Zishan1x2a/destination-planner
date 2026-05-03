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
import { InvitationBorder, OrnamentDivider, SectionHeader } from '@/components/OrnamentalElements';

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
          className: "bg-card text-card-foreground border-primary font-serif text-lg",
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
    <section id="rsvp" className="py-32 px-6 luxury-bg relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* RSVP Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <InvitationBorder className="invitation-card p-8 md:p-12 h-full">
              <SectionHeader label="Join Us" subLabel="RSVP" />
              
              {stats && (
                <p className="text-card-foreground/70 font-serif italic text-center mb-8 text-lg">
                  Join {stats.attending} guests who have already confirmed!
                </p>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="guestName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary uppercase tracking-widest text-[10px]">Full Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your Name" 
                            {...field} 
                            className="bg-transparent border-0 border-b border-primary/40 rounded-none px-0 text-card-foreground font-serif text-xl focus-visible:ring-0 focus-visible:border-primary shadow-none italic" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary uppercase tracking-widest text-[10px]">Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="john@example.com" 
                              {...field} 
                              className="bg-transparent border-0 border-b border-primary/40 rounded-none px-0 text-card-foreground font-serif text-xl focus-visible:ring-0 focus-visible:border-primary shadow-none italic" 
                            />
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
                          <FormLabel className="text-primary uppercase tracking-widest text-[10px]">Phone</FormLabel>
                          <FormControl>
                            <Input 
                              type="tel" 
                              placeholder="+1 234 567 8900" 
                              {...field} 
                              className="bg-transparent border-0 border-b border-primary/40 rounded-none px-0 text-card-foreground font-serif text-xl focus-visible:ring-0 focus-visible:border-primary shadow-none italic" 
                            />
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
                      <FormItem className="space-y-4 py-4">
                        <FormLabel className="text-primary uppercase tracking-widest text-[10px]">Will you attend?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <FormItem className="flex items-center space-x-4 space-y-0 bg-black/5 p-4 border border-primary/20">
                              <FormControl>
                                <RadioGroupItem value={RsvpAttendanceStatus.attending} className="text-primary border-primary" />
                              </FormControl>
                              <FormLabel className="font-normal font-serif text-xl text-card-foreground italic flex-1 cursor-pointer">
                                Joyfully Accepts
                              </FormLabel>
                              <span className="text-primary text-sm">✦</span>
                            </FormItem>
                            <FormItem className="flex items-center space-x-4 space-y-0 bg-black/5 p-4 border border-primary/20">
                              <FormControl>
                                <RadioGroupItem value={RsvpAttendanceStatus.not_sure} className="text-primary border-primary" />
                              </FormControl>
                              <FormLabel className="font-normal font-serif text-xl text-card-foreground italic flex-1 cursor-pointer">
                                Not Sure Yet
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-4 space-y-0 bg-black/5 p-4 border border-primary/20">
                              <FormControl>
                                <RadioGroupItem value={RsvpAttendanceStatus.not_attending} className="text-primary border-primary" />
                              </FormControl>
                              <FormLabel className="font-normal font-serif text-xl text-card-foreground italic flex-1 cursor-pointer">
                                Regretfully Declines
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                    <FormField
                      control={form.control}
                      name="numberOfGuests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary uppercase tracking-widest text-[10px]">Number of Guests</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              {...field} 
                              className="bg-transparent border-0 border-b border-primary/40 rounded-none px-0 text-card-foreground font-serif text-xl focus-visible:ring-0 focus-visible:border-primary shadow-none italic" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="needsTravelHelp"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 py-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-card-foreground font-serif italic text-lg cursor-pointer">
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
                        <FormLabel className="text-primary uppercase tracking-widest text-[10px]">Message for the couple</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any dietary requirements or just say hello..." 
                            className="resize-none bg-transparent border-0 border-b border-primary/40 rounded-none px-0 text-card-foreground font-serif text-xl focus-visible:ring-0 focus-visible:border-primary shadow-none italic min-h-[60px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <OrnamentDivider variant="line" color="hsl(var(--primary))" />
                    <Button 
                      type="submit" 
                      disabled={createRsvp.isPending}
                      className="w-full py-8 font-serif tracking-widest uppercase text-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-none border border-primary/50"
                    >
                      {createRsvp.isPending ? "Sending..." : "Submit RSVP"}
                    </Button>
                  </div>
                </form>
              </Form>
            </InvitationBorder>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center space-y-8"
          >
            <SectionHeader label="Get in Touch" subLabel="Contact Us" />
            
            <div className="space-y-6">
              {contacts.map((contact, index) => (
                <InvitationBorder key={index} className="invitation-card !p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center font-serif text-primary italic text-xl">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl mb-1 text-card-foreground italic">{contact.name}</h3>
                      <p className="text-primary text-[10px] uppercase tracking-widest">{contact.relation}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="rounded-full border-primary/50 text-primary hover:bg-primary/10 w-12 h-12 bg-transparent"
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
                        className="rounded-full border-primary/50 text-[#25D366] hover:bg-primary/10 w-12 h-12 bg-transparent"
                        asChild
                      >
                        <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer">
                          <SiWhatsapp size={20} />
                        </a>
                      </Button>
                    )}
                  </div>
                </InvitationBorder>
              ))}
            </div>
            
            <div className="mt-12 text-center pt-8">
              <OrnamentDivider variant="diamond" color="hsl(var(--primary))" />
              <p className="text-card-foreground/70 font-serif italic text-lg mt-8">We look forward to celebrating with you.</p>
              <p className="mt-2 font-serif text-3xl text-primary italic">#PriyaWedsArjun</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}