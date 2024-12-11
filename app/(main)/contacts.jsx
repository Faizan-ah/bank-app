import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as Contacts from "expo-contacts";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [selectedFavourites, setSelectedFavourites] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { amount } = useLocalSearchParams();

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        // Organize contacts alphabetically
        const sortedContacts = data
          .filter((contact) => contact.phoneNumbers?.length > 0)
          .sort((a, b) => a.name.localeCompare(b.name));

        setContacts(sortedContacts);
      }
      setLoading(false);
    })();
  }, []);

  const groupContactsByInitial = (contacts) => {
    return contacts.reduce((acc, contact) => {
      const initial = contact.name[0].toUpperCase();
      if (!acc[initial]) acc[initial] = [];
      acc[initial].push(contact);
      return acc;
    }, {});
  };

  const groupedContacts = groupContactsByInitial(contacts);

  const handleContactPress = (contact) => {
    router.push({
      pathname: "/send-money",
      params: {
        phoneNumber: contact.phoneNumbers[0].number,
        amount,
      },
    });
  };

  const handleAddToFavourites = () => {
    const selectedContacts = contacts.filter((contact) =>
      selectedFavourites.includes(contact.id)
    );

    const newFavourites = selectedContacts.filter(
      (contact) =>
        !favourites.some((favContact) => favContact.id === contact.id)
    );

    const removedFavourites = favourites.filter(
      (favContact) => !selectedFavourites.includes(favContact.id)
    );

    setFavourites((prevFavourites) => [
      ...prevFavourites.filter(
        (favContact) => !removedFavourites.includes(favContact)
      ),
      ...newFavourites,
    ]);
    setIsSelecting(false);
  };

  const handleSelectContact = (contact) => {
    const isSelected = selectedFavourites.includes(contact.id);
    if (isSelected) {
      setSelectedFavourites(
        selectedFavourites.filter((id) => id !== contact.id)
      );
    } else {
      setSelectedFavourites([...selectedFavourites, contact.id]);
    }
  };
  const handleBackPress = () => {
    router.back();
  };

  const render = ({ item: initial }) => (
    <View style={styles.groupContainer}>
      <Text style={styles.initialCard}>{initial}</Text>
      {groupedContacts[initial].map((contact) => {
        const isSelected = selectedFavourites.includes(contact.id);
        return (
          <View key={contact.id}>
            <TouchableOpacity
              style={[styles.contactCard, isSelected && styles.selectedCard]}
              onPress={() =>
                isSelecting
                  ? handleSelectContact(contact)
                  : handleContactPress(contact)
              }
            >
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactDetails}>
                  {contact.phoneNumbers[0].number}
                </Text>
              </View>
              {isSelecting && (
                <TouchableOpacity
                  style={styles.selectBtn}
                  onPress={() => handleSelectContact(contact)}
                >
                  <MaterialIcons
                    name={
                      isSelected ? "check-circle" : "radio-button-unchecked"
                    }
                    size={24}
                    color={isSelected ? "#007bff" : "#aaa"}
                  />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );

  if (loading) {
    // Show loading indicator while contacts are being fetched
    return (
      <View style={[styles.container, styles.loaderContainer]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.heading}>Contact List</Text>
      </View>

      <Text style={styles.sectionHeading}>Favourites</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.favourites}
        contentContainerStyle={styles.favouritesContentContainer}
      >
        <TouchableOpacity
          disabled={isSelecting}
          onPress={() => setIsSelecting(true)}
          style={
            isSelecting
              ? { ...styles.addToFavouritesBtn, backgroundColor: "lightgrey" }
              : styles.addToFavouritesBtn
          }
        >
          <MaterialIcons name="add" size={30} color="white" />
        </TouchableOpacity>

        {favourites.map((contact, index) => (
          <TouchableOpacity
            key={index}
            style={styles.avatarContainer}
            onPress={() => handleContactPress(contact)}
          >
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${contact.name}&background=random`,
              }}
              style={styles.avatar}
            />
            <Text style={styles.avatarName}>{contact.name.split(" ")[0]}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionHeading}>All Contacts</Text>
      <FlatList
        data={Object.keys(groupedContacts)}
        keyExtractor={(item) => item}
        renderItem={render}
      />

      {isSelecting && (
        <TouchableOpacity
          onPress={handleAddToFavourites}
          style={styles.doneButton}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ContactsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  backButton: {
    marginRight: 10,
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: "#007bff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 10,
    paddingBottom: 2,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginVertical: 10,
  },
  //   TODO: fix styling for last element padding
  favourites: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingLeft: 20,
    borderRadius: 40,
    height: 130,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  favouritesContentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",
    width: 100,
    height: 100,
    justifyContent: "center",
    marginRight: 15,
    paddingHorizontal: 0,
  },
  addToFavouritesBtn: {
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    width: 50,
    height: 50,
    marginTop: 3,
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarName: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    flexWrap: "wrap",
    width: 100,
    paddingHorizontal: 5,
    marginTop: 5,
  },
  groupContainer: {
    marginBottom: 20,
    backgroundColor: "white",
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  initialCard: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginTop: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "white",
  },
  contactCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    borderColor: "#ddd",
  },
  selectedCard: {
    borderColor: "#007bff",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  contactDetails: {
    fontSize: 14,
    color: "#777",
  },
  selectBtn: {
    marginLeft: 10,
  },
  doneButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  doneButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
