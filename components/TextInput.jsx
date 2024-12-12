import React, { useState } from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useController, useFormContext } from "react-hook-form";

export const TextInput = (props) => {
  const { name } = props;

  const formContext = useFormContext();

  if (!formContext || !name) {
    const msg = !formContext
      ? "TextInput must be wrapped by the FormProvider"
      : "Name must be defined";
    console.error(msg);
    return null;
  }

  return <ControlledInput {...props} />;
};

const ControlledInput = (props) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const formContext = useFormContext();
  const {
    formState: { errors },
  } = formContext;

  const {
    name,
    label,
    rules,
    defaultValue,
    secureTextEntry,
    disabled,
    ...inputProps
  } = props;

  const { field } = useController({ name, rules, defaultValue });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <RNTextInput
          style={[styles.input, disabled && styles.disabledInput]} // Add disabled style
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          editable={!disabled} // Make the input field non-editable if disabled
          {...inputProps}
        />
        {secureTextEntry &&
          !disabled && ( // Only show the password visibility icon if not disabled
            <Pressable onPress={togglePasswordVisibility} style={styles.icon}>
              <MaterialIcons
                name={isPasswordVisible ? "visibility" : "visibility-off"}
                size={24}
                color="gray"
              />
            </Pressable>
          )}
      </View>
      {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "black",
    marginBottom: 10,
    marginLeft: 0,
  },
  container: {
    flex: -1,
    justifyContent: "center",
    marginVertical: 8,
    marginHorizontal: "auto",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    width: "100%",
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
  },
  icon: {
    paddingHorizontal: 8,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#888",
    borderColor: "#ddd",
  },
});
