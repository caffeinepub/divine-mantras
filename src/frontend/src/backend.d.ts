import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Verse {
    sanskritText: string;
    meaning: MultilingualText;
    transliteration: string;
    number: bigint;
}
export interface Mantra {
    id: bigint;
    sanskritText: string;
    meaning: MultilingualText;
    name: MultilingualText;
    deityId: bigint;
    audioUrl: string;
    transliteration: string;
    category: string;
    benefits: MultilingualText;
}
export interface UserPreferences {
    bookmarkedItems: Array<string>;
    language: string;
}
export interface Stotra {
    id: bigint;
    title: MultilingualText;
    verses: Array<Verse>;
    category: string;
}
export interface Deity {
    id: bigint;
    name: MultilingualText;
    description: MultilingualText;
    iconEmoji: string;
}
export interface MultilingualText {
    hindi: string;
    telugu: string;
    english: string;
}
export interface backendInterface {
    addFavorite(itemId: bigint): Promise<void>;
    getAllDeities(): Promise<Array<Deity>>;
    getAllMantras(): Promise<Array<Mantra>>;
    getAllStotras(): Promise<Array<Stotra>>;
    getDailySuggestion(): Promise<bigint>;
    getMantraById(id: bigint): Promise<Mantra | null>;
    getMantrasByDeity(deityId: bigint): Promise<Array<Mantra>>;
    getPreferences(): Promise<UserPreferences>;
    getStotraById(id: bigint): Promise<Stotra | null>;
    getUserFavorites(): Promise<Array<bigint>>;
    removeFavorite(itemId: bigint): Promise<void>;
    searchMantras(keyword: string): Promise<Array<Mantra>>;
    setPreferences(language: string, bookmarkedItems: Array<string>): Promise<void>;
}
