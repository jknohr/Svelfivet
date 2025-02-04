export type ContactInfo = {
    email: string;
    secondary_email?: string;
    main_phone_number: string;
    secondary_phone_number?: string;
};

export type Language = 'en' | 'th' | 'zh';

export type UserStatus = 'Pending' | 'Active' | 'Suspended' | 'Inactive';

export type VerificationStatus = 'Unverified' | 'Pending' | 'Verified' | 'Failed';

export type UserRole = 'user' | 'admin' | 'superadmin';

export interface User {
  id: string;
    firstname: string;
    lastname: string;
  email: string;
    secondary_email?: string;
    main_phone_number: string;
    secondary_phone_number?: string;
    countryOfResidence: string;
    status: UserStatus;
    verification_status: VerificationStatus;
    listing_ids: string[];
  role: UserRole;
    created_at: string;
    updated_at: string;
    last_login?: string;
} 