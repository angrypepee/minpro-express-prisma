import { authorize } from '../../src/utils/authorize';

export default async function handler(req, res) {
  if (authorize(req, res, ['ORGANIZER'])) {
    // Handle the event creation logic here
    res.status(201).json({ message: 'Event created successfully' });
  }
}
