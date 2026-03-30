-- Optional: Seed default data (run after admin-schema.sql)
-- Skip if you already have data

INSERT INTO projects (name, description, tags, image_url, sort_order) VALUES
  ('Vikash Tech Solution', 'Collaborative project with Vikash Tech Solution — delivering tech solutions for their business needs.', ARRAY['Web', 'AI'], '/images/projects/vikash-tech.jpg', 1),
  ('E-Commerce Platform Redesign', 'A complete overhaul of a legacy e-commerce platform.', ARRAY['Web', 'UI/UX', 'Next.js'], '/images/projects/ecommerce.jpg', 2),
  ('AI Customer Support Agent', 'Intelligent multi-language support bot using OpenAI.', ARRAY['AI System', 'Python', 'Cloud'], '/images/projects/ai-support.jpg', 3),
  ('Fitness Tracking Mobile App', 'Cross-platform mobile app for workouts and diets.', ARRAY['Mobile App', 'React Native'], '/images/projects/fitness.jpg', 4),
  ('Real Estate Dashboard', 'Analytics dashboard for real estate agents.', ARRAY['Web', 'UI/UX', 'Dashboard'], '/images/projects/real-estate.jpg', 5),
  ('Blockchain Logistics Tracker', 'Supply chain tracking with blockchain.', ARRAY['Web3', 'Other'], '/images/projects/logistics.jpg', 6);

INSERT INTO plans (name, tagline, price, features, cta, popular, sort_order) VALUES
  ('Starter', 'Best for small projects & MVPs', 'Contact Us', '["Up to 5 pages / basic features", "Responsive design", "1 revision round", "Basic SEO setup", "2 weeks delivery"]'::jsonb, 'Get Started', false, 1),
  ('Growth', 'Best for growing businesses', '$2K+', '["Up to 15 pages / advanced features", "AI integration (basic)", "3 revision rounds", "Full SEO + analytics", "Priority support", "4 weeks delivery"]'::jsonb, 'Start a Project', true, 2),
  ('Enterprise', 'For large & complex systems', 'Custom Quote', '["Unlimited scope", "Full AI/ML integration", "Custom architecture", "Dedicated team", "Ongoing maintenance", "Custom timeline"]'::jsonb, 'Get a Custom Quote', false, 3);
