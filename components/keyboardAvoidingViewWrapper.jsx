import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Platform,
} from "react-native";

const KeyboardAvoidingViewWrapper = (props) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
        }}
        keyboardVerticalOffset={props.offset ?? 50}
      >
        <TouchableWithoutFeedback
          style={{
            flex: 1,
          }}
          onPress={Keyboard.dismiss}
        >
          {props.children}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default KeyboardAvoidingViewWrapper;
