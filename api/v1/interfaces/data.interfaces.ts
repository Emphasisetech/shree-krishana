
export interface ICommonDetails {
    id: number;
    name: string;
    organization?: string;
    designation?: number;
    image?: string;
    is_deleted?: boolean;
    address?: string;
}

export interface IMaterialDetails extends ICommonDetails {
    type: number;
    serial_number: string;
    file: string;
    carry_by: string;
    purpose: string;
    // in_time: string;
    // out_time: string;
    in_date: string;
    out_date: string;
    area_permitted: string;
    remarks: string;
    added_by: number;
    added_by_id: number;
    added_by_name: string;
    added_by_unique_id: string;
    is_recommend: boolean;
    recommend_by_id: number;
    recommend_by_name: string;
    is_approved: boolean;
    approved_by_id: number;
    approved_by_name: string;
    carry_by_id: number;
    carry_by_name: string;
}


export interface IEmployeeDetails extends ICommonDetails {
    role: number;
    username: string;
    is_temporary_password: string;
    department: string;
    password?: string;
    id_card_number: string;
    phone_number: string;
}

export interface IQuestionAnswerDetails {
    id: number;
    question: number;
    answer: string;
}

export interface IVisitorDetails {
    id: number;
    name: string;
    organization: string;
    id_proof_number: string;
    purpose: string;
    image: string;
    id_proof_file: string;
    // in_time: string;
    // out_time: string;
    in_date: string;
    out_date: string;
    is_recommend: boolean;
    is_approved: boolean;
    is_deleted: boolean;
    remarks: string;
    designation: string;
    added_by_id: number;
    added_by_name: string;
    added_by_unique_id: string;
    recommend_by_id: number;
    recommend_by_name: string;
    approved_by_id: number;
    approved_by_name: string;
    person_to_meet_id: number;
    person_to_meet_name: string;
    id_proof_type_id: number;
    id_proof_type_name: string;
    zone_id: number;
    zone_name: string;
    zone_color: string;
    area_permitted_id: number;
    area_permitted_name: string;
}


export interface IMasterData {
    id: number;
    name: string;
    is_deleted: boolean;
}

export interface IZoneDetails extends IMasterData {
    color: string;
}

export interface IAreaDetails extends IMasterData {
    zone: number;
}


export interface IResponce {
    message: string;
    success: Boolean;
    data?: any;
    error?: any;
}
export interface ICommonServices {
    status_code: number;
    data: IResponce
}

export interface IPayloadUser {
    exp: number;
    iat: number;
    id: number;
    unique_id: string;
    role: number
    username: string
}
export interface IMataData {
    page_number?: string;
    page_size?: string;
    is_next?: string;
    search_key?: string;
}

export interface IVisitorDetails1 {
    id: number;
    name: string;
    organization: string;
    id_proof_number: string;
    purpose: string;
    image: string;
    id_proof_file: string;
    in_date: string;
    out_date: string;
    is_recommend: boolean;
    is_approved: boolean;
    is_deleted: boolean;
    designation: string;
    in_time?: string;
    out_time?: string;
    added_by_id: number;
    added_by_name: string;
    added_by_unique_id: string;
    recommend_by_id?: number;
    recommend_by_name?: string;
    approved_by_id?: number;
    approved_by_name?: string;
    person_to_meet_id: number;
    person_to_meet_name: string;
    id_proof_type_id: number;
    id_proof_type_name: string;
    zone_id: number;
    zone_name: string;
    zone_color: string;
    area_permitted: IMasterData;
    remarks: string;
    update_date?: string;
    delete_date?: string;
    added_by?: string;
    recommend_by?: string;
    approved_by?: string;
    person_to_meet?: string;
    id_proof_type?: string;
    zone?: string;
}