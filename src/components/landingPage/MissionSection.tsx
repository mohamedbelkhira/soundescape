import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function MissionSection() {
  return (
    <section className="relative py-24 bg-slate-800/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur">
            <CardHeader className="text-center space-y-6 p-12">
              <CardTitle className="text-3xl text-white">Our Mission</CardTitle>
              <CardDescription className="text-xl text-gray-300 leading-relaxed">
                To make the world's best stories <strong>unmissable</strong> &mdash; through sound.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}