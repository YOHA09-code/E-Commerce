import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse products, add items to cart, and proceed to checkout to complete your order.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Chapa (ETB) and Stripe (USD) payments securely.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship globally with local delivery options available in Ethiopia.",
  },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <h2 className="text-3xl font-bold font-ethiopic mb-4 text-primary">
          ድጋፍ ማዕከል
        </h2>
        <p className="text-muted-foreground">
          Find answers to common questions
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{faq.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.a}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
