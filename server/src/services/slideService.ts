import { Presentation } from "../models/Presentation";

// CREATE PRESENTATION
export async function createPresentationService(data: any) {
  return Presentation.create(data);
}

// LIST ALL PRESENTATIONS FOR USER
export async function listPresentationsService(userId: string) {
  return Presentation.find({ userId }).sort({ createdAt: -1 });
}

// GET ONE PRESENTATION
export async function getPresentationService(id: string, userId: string) {
  return Presentation.findOne({ _id: id, userId });
}

// UPDATE PRESENTATION
export async function updatePresentationService(
  id: string,
  userId: string,
  data: any
) {
  return Presentation.findOneAndUpdate(
    { _id: id, userId },
    data,
    { new: true }
  );
}

// DELETE PRESENTATION
export async function deletePresentationService(id: string, userId: string) {
  return Presentation.findOneAndDelete({ _id: id, userId });
}
