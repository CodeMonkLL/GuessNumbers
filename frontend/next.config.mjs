const backend = process.env.BACKEND_URL || "http://backend:5000";

export default {
  async rewrites() {
    return [{ source: "/api/highscores", destination: `${backend}/` }];
  },
};
