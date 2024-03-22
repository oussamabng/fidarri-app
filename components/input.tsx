import React, { useState, FC } from "react";
import { View, Text, TextInput, TextStyle, ViewStyle } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { black, primary } from "@/constants/Colors";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

interface InputProps {
  label: string;
  iconPosition?: "right" | "left" | null;
  iconName?: keyof typeof Icon.glyphMap | null;
  error?: string | null;
  password?: boolean;
  arabic?: boolean;
  phone?: boolean;
  disabledBg?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  onFocus?: () => void;
  onIconClick?: () => void;
  [key: string]: any;
}

const Input: FC<InputProps> = ({
  label,
  iconName,
  error,
  password,
  iconPosition,
  phone,
  disabled = false,
  multiline = false,
  disabledBg = false,
  arabic = false,
  onFocus = () => {},
  onIconClick = () => {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(password);

  const inputStyle: TextStyle = {
    flex: 1,
    fontSize: RFValue(12),
    height: "100%",
    opacity: 1,
    color: black,
    textAlign: arabic ? "right" : "left",
  };

  const containerStyle: ViewStyle = {
    height: RFValue(multiline ? 100 : 40),
    backgroundColor: disabledBg ? "#F6F6F6" : "white",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: RFValue(8),
    flexDirection: "row",
    alignItems: "center",
    borderColor: error ? "red" : isFocused ? primary : "#E0E1E4",
  };

  const errorStyle: TextStyle = {
    fontSize: RFValue(10),
    color: "red",
    marginTop: RFValue(6),
  };

  return (
    <View style={{}}>
      {label.length > 0 && (
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
      )}

      <View style={containerStyle}>
        {phone && (
          <Text
            style={{
              color: black,
              fontSize: RFValue(12),
              marginRight: RFValue(4),
            }}
          >
            +213
          </Text>
        )}
        {iconPosition === "left" && iconName && (
          <Icon
            onPress={() => {
              onIconClick();
            }}
            style={{
              fontSize: RFValue(16),
              color: "#8D8E90",
              marginRight: RFValue(8),
            }}
            name={iconName}
          />
        )}
        {password && arabic && (
          <Icon
            style={{
              fontSize: RFValue(18),
              color: "#8D8E90",
              marginRight: RFValue(8),
            }}
            onPress={() => {
              setHidePassword((prevState) => !prevState);
            }}
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
          />
        )}
        <TextInput
          multiline={multiline}
          numberOfLines={multiline ? 40 : 1}
          secureTextEntry={hidePassword}
          autoCorrect={false}
          selectionColor={primary}
          returnKeyType="done"
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          style={inputStyle}
          {...props}
          editable={!disabled}
          contextMenuHidden={disabled}
          keyboardType="default"
        />
        {iconPosition === "right" && iconName && (
          <Icon
            onPress={() => {
              onIconClick();
            }}
            style={{
              fontSize: RFValue(16),
              color: "#8D8E90",
              marginRight: RFValue(8),
              borderRadius: 999,
            }}
            name={iconName}
          />
        )}
        {password && !arabic && (
          <Icon
            style={{
              fontSize: RFValue(18),
              color: "#8D8E90",
              marginRight: RFValue(8),
            }}
            onPress={() => {
              setHidePassword((prevState) => !prevState);
            }}
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
          />
        )}
      </View>
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
};

export default Input;

//View   <div></div>

// Text p span label
