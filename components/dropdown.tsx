import React, { useState } from "react";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import SelectDropdown from "react-native-select-dropdown";
import { primary } from "@/constants/Colors";

const Dropdown = ({
  label,
  data,
  onFocus = () => {},
  onChangeText = () => {},
  value,
  onSelect,
  disabledBg = false,
  arabic = false,
  defaultButtonText,
  error,
  ...props
}: {
  label: string;
  data: string[];
  onFocus?: () => void;
  onChangeText?: (text: string, index?: number) => void;
  value?: string | null;
  onSelect?: any;
  arabic?: boolean;

  disabledBg?: boolean;
  defaultButtonText?: string | null;
  error?: string | null;
  [key: string]: any;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View>
      <Text
        style={{
          fontSize: RFValue(12),
          fontWeight: "500",
          color: "#555555",
          marginBottom: RFValue(6),
          textAlign: arabic ? "right" : "left",
        }}
      >
        {label}
      </Text>
      <View>
        <SelectDropdown
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          {...props}
          data={data}
          dropdownIconPosition="right"
          defaultButtonText={
            value ||
            defaultButtonText ||
            (data?.length > 0 && data[0]) ||
            "Select"
          } // Use the value prop
          renderDropdownIcon={(isOpened: any) => {
            return (
              <Feather
                name={Boolean(isOpened) ? "chevron-up" : "chevron-down"}
                color={"#000"}
                size={18}
              />
            );
          }}
          onSelect={(selectedItem, index) => {
            onChangeText(selectedItem, index);
            onSelect && onSelect(selectedItem, index); // Call the onSelect prop
          }}
          buttonStyle={{
            height: RFValue(40),
            backgroundColor: disabledBg ? "#F6F6F6" : "white",
            borderWidth: 1,
            borderRadius: 4,
            borderColor: error ? "red" : isFocused ? primary : "#E0E1E4",
            width: "100%",
          }}
          buttonTextStyle={{
            textAlign: "left",
            fontSize: RFValue(12),
          }}
          rowStyle={{
            backgroundColor: "white",
            borderRadius: 4,
          }}
          rowTextStyle={{
            textAlign: "left",
            fontSize: RFValue(12),
          }}
          // search
          searchInputStyle={{
            backgroundColor: "#EEEEEE",
            borderRadius: 8,
            borderBottomWidth: 1,
            borderBottomColor: "#E0E1E4",
          }}
          searchInputTxtColor="#222"
          searchPlaceHolder="Search here"
          searchPlaceHolderColor="darkgrey"
        />
      </View>
      {error && (
        <Text
          style={{ fontSize: RFValue(10), color: "red", marginTop: RFValue(6) }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default Dropdown;
