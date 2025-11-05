import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/ui/animated-button";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <h2 className="text-3xl font-bold font-ethiopic mb-4 text-primary">
          አግኙን
        </h2>
        <p className="text-muted-foreground">
          We'd love to hear from you. Send us a message and we'll respond as
          soon as possible.
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Your name" />
            <Input type="email" placeholder="Your email" />
            <Input placeholder="Subject" />
            <textarea
              className="w-full min-h-[200px] p-3 border rounded-md"
              placeholder="Your message"
            />
            <AnimatedButton className="w-full">Send Message</AnimatedButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
