import { useBackHeaderStore } from "@/store/useBackHeaderStore";
import { Appbar } from "react-native-paper";
import { Text } from "react-native";

interface BackHeaderProps {
  navigation: any;
  loading?: boolean;
}

const BackHeader: React.FC<BackHeaderProps> = ({
  navigation,
  loading = false,
}) => {
  /*   const { display } = useBackHeaderStore((state: any) => ({
    display: state.display,
  })); */
  return (
    <Appbar.Header
      style={{
        backgroundColor: "white",
        /*    display, */
      }}
    >
      <Appbar.BackAction
        color="black"
        onPress={() => {
          navigation.pop();
        }}
      />
    </Appbar.Header>
  );
};

export default BackHeader;
