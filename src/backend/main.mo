import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type MultilingualText = {
    english : Text;
    hindi : Text;
    telugu : Text;
  };

  type Mantra = {
    id : Nat;
    deityId : Nat;
    name : MultilingualText;
    sanskritText : Text;
    transliteration : Text;
    meaning : MultilingualText;
    benefits : MultilingualText;
    category : Text; // "mantra", "dhyana", "stotra"
    audioUrl : Text;
  };

  type Deity = {
    id : Nat;
    name : MultilingualText;
    description : MultilingualText;
    iconEmoji : Text;
  };

  type Verse = {
    number : Nat;
    sanskritText : Text;
    transliteration : Text;
    meaning : MultilingualText;
  };

  type Stotra = {
    id : Nat;
    title : MultilingualText;
    verses : [Verse];
    category : Text;
  };

  module Mantra {
    public func compare(a : Mantra, b : Mantra) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module Deity {
    public func compare(a : Deity, b : Deity) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module Stotra {
    public func compare(a : Stotra, b : Stotra) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type UserPreferences = {
    language : Text;
    bookmarkedItems : [Text];
  };

  let mantras = Map.empty<Nat, Mantra>();
  let deities = Map.empty<Nat, Deity>();
  let stotras = Map.empty<Nat, Stotra>();
  let userFavorites = Map.empty<Principal, List.List<Nat>>();
  let preferencesStore = Map.empty<Principal, UserPreferences>();

  public shared ({ caller }) func setPreferences(language : Text, bookmarkedItems : [Text]) : async () {
    let preferences : UserPreferences = {
      language;
      bookmarkedItems;
    };
    preferencesStore.add(caller, preferences);
  };

  public shared ({ caller }) func getPreferences() : async UserPreferences {
    switch (preferencesStore.get(caller)) {
      case (null) { Runtime.trap("Preferences not found for user") };
      case (?preferences) { preferences };
    };
  };

  public shared ({ caller }) func addFavorite(itemId : Nat) : async () {
    let favorites = switch (userFavorites.get(caller)) {
      case (null) { List.empty<Nat>() };
      case (?favorites) { favorites };
    };
    if (favorites.contains(itemId)) {
      Runtime.trap("Item already in favorites");
    };
    favorites.add(itemId);
    userFavorites.add(caller, favorites);
  };

  public shared ({ caller }) func removeFavorite(itemId : Nat) : async () {
    switch (userFavorites.get(caller)) {
      case (null) {
        Runtime.trap("No favorites found for user");
      };
      case (?favorites) {
        let newFavorites = favorites.filter(func(fav) { fav != itemId });
        userFavorites.add(caller, newFavorites);
      };
    };
  };

  public query ({ caller }) func getUserFavorites() : async [Nat] {
    switch (userFavorites.get(caller)) {
      case (null) { [] };
      case (?favorites) { favorites.toArray() };
    };
  };

  public query ({ caller }) func getAllDeities() : async [Deity] {
    deities.values().toArray().sort();
  };

  public query ({ caller }) func getMantrasByDeity(deityId : Nat) : async [Mantra] {
    mantras.values().toArray().filter(
      func(mantra) { mantra.deityId == deityId }
    );
  };

  public query ({ caller }) func getAllMantras() : async [Mantra] {
    mantras.values().toArray().sort();
  };

  public query ({ caller }) func getMantraById(id : Nat) : async ?Mantra {
    mantras.get(id);
  };

  public query ({ caller }) func getAllStotras() : async [Stotra] {
    stotras.values().toArray().sort();
  };

  public query ({ caller }) func getStotraById(id : Nat) : async ?Stotra {
    stotras.get(id);
  };

  public query ({ caller }) func getDailySuggestion() : async Nat {
    let dayIndex = (Time.now() / (24 * 60 * 60 * 1000000000)) % 7;
    switch (dayIndex) {
      case (0) { 3 };
      case (1) { 5 };
      case (2) { 8 };
      case (3) { 12 };
      case (4) { 15 };
      case (5) { 18 };
      case (6) { 21 };
      case (_) { 1 };
    };
  };

  public query ({ caller }) func searchMantras(keyword : Text) : async [Mantra] {
    mantras.values().toArray().filter(
      func(mantra) {
        mantra.name.english.contains(#text keyword) or
        mantra.name.hindi.contains(#text keyword) or
        mantra.name.telugu.contains(#text keyword) or
        mantra.sanskritText.contains(#text keyword) or
        mantra.transliteration.contains(#text keyword) or
        mantra.meaning.english.contains(#text keyword) or
        mantra.meaning.hindi.contains(#text keyword) or
        mantra.meaning.telugu.contains(#text keyword)
      }
    );
  };

  system func preupgrade() {};
  system func postupgrade() {};
};
