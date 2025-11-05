import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, Globe, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4">About EthioShop</h1>
        <h2 className="text-3xl font-bold font-ethiopic mb-4 text-primary">
          ስለ ኢትዮሾፕ
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connecting Ethiopian vendors with global buyers through a modern,
          bilingual e-commerce platform.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
        <Card>
          <CardHeader>
            <Target className="h-8 w-8 text-primary mb-4" />
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              To empower Ethiopian businesses and provide customers with quality
              products and excellent service.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-4" />
            <CardTitle>Our Community</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Serving thousands of vendors and customers across Ethiopia and
              beyond.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Globe className="h-8 w-8 text-primary mb-4" />
            <CardTitle>Bilingual Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Full support for English and Amharic languages.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Award className="h-8 w-8 text-primary mb-4" />
            <CardTitle>Quality Guaranteed</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Verified vendors and quality products you can trust.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
