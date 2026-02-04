import { Presentation,IPresentation } from "../models/Presentation";


export async function createPresentationInDb(data: {
  userId: string;
  title: string;
  slides: any[];
}) {
  return Presentation.create(data);
}

export async function getAllPresentationsForUser(userId: string) {
  return Presentation.find({
    userId,
  }).sort({ updatedAt: -1 });
}

export async function getPresentationById(id: string) {
  return Presentation.findById(id);
}

/*export async function updatePresentationById(id: string, update: any) {
  return Presentation.findByIdAndUpdate(id, update, { new: true });
}*/

export async function updatePresentationById(id: string, update: Partial<IPresentation>) {
  return Presentation.findByIdAndUpdate(id, update, { new: true });
}


export async function deletePresentationById(id: string) {
  return Presentation.findByIdAndDelete(id);
}

// services/presentationService.ts

export async function searchPresentationsInDb(userId: string, search: string) {
  return Presentation.find({
    userId, // owner only for now

    $or: [
      { title: { $regex: search, $options: "i" } },
      { "slides.title": { $regex: search, $options: "i" } },
      { "slides.bullets": { $regex: search, $options: "i" } }
    ]
  }).sort({ updatedAt: -1 });
}


/* -----------------------------
   Locking
------------------------------*/

export async function lockPresentation(id: string, userId: string) {
  return Presentation.findByIdAndUpdate(
    id,
    {
      lock: {
        isLocked: true,
        lockedBy: userId,
        lockedAt: new Date(),
      },
    },
    { new: true }
  );
}

export async function unlockPresentation(id: string) {
  return Presentation.findByIdAndUpdate(
    id,
    {
      lock: {
        isLocked: false,
        lockedBy: null,
        lockedAt: null,
      },
    },
    { new: true }
  );
}

// Check if user is owner before modifying editors
export async function getPresentationForSharing(docId: string, userId: string) {
  return Presentation.findOne({
    _id: docId,
    userId
  });
}



// Add editors
export async function addEditorsToPresentation(presId: string, userIds: string[]) {
  return Presentation.findByIdAndUpdate(
    presId,
    { $addToSet: { editors: { $each: userIds } } },
    { new: true }
  );
}
