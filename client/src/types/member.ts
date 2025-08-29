export interface Member {
  id: string;
  dateOfBirth: string;
  imageUrl?: string;
  displayName: string;
  created: string;
  lastActive: string;
  gender: string;
  description?: string;
  city: string;
  country: string;
}
export interface Photo {
  id: number;
  url: string;
  publicId?: any;
  memberId: string;
}
export interface EditableMember {
  displayName: string;
  description?: string;
  city: string;
  country: string;
}
export class MemberParams {
  gender?: string;
  minAge = 18;
  maxAge = 100;
  pageNumber = 1;
  pageSize = 10;
  orderBy = 'lastActive';
}
