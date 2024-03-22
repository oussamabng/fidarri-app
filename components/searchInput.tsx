import { View, TextInput, TouchableOpacity } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { primary, text2 } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

interface SearchInputProps {
  setEnableSearch: (state: boolean) => void;
  setSearchQuery: (state: string) => void;
  searchQuery: string;
  enableSearch: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  setEnableSearch,
  enableSearch,
  searchQuery,
  setSearchQuery,
}) => {
  const { t, i18n } = useTranslation();

  const navigation = useRouter();

  const onChangeSearch = (query: string) => setSearchQuery(query);
  return (
    <View
      style={{
        flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderColor: "#E0E1E4",
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: RFValue(18),
      }}
    >
      <Feather
        style={{
          padding: 10,
        }}
        name="search"
        size={16}
        color={text2}
      />
      <TextInput
        style={{
          flex: 1,
          paddingTop: 10,
          paddingRight: 8,
          paddingBottom: 10,
          paddingLeft: 0,
          backgroundColor: "#fff",
          fontSize: RFValue(12),
          textAlign: i18n.language === "ar" ? "right" : "left",
        }}
        /*  onBlur={(e) => {
          e.preventDefault();
          //searchQuery.length === 0 && setEnableSearch(false);
        }} */
        selectionColor={primary}
        placeholder={t("Search")}
        value={searchQuery}
        onChangeText={onChangeSearch}
        underlineColorAndroid="transparent"
      />
      <TouchableOpacity
        disabled={!enableSearch}
        onPress={() => {
          navigation.push("/filter");
        }}
        style={{
          zIndex: 999999999999,
        }}
      >
        <MaterialIcons
          style={{
            padding: 10,
          }}
          name="filter-list"
          size={16}
          color={text2}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
