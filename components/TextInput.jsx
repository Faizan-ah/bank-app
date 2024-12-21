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
    labelStyles,
    ...inputProps
  } = props;

  const { field } = useController({ name, rules, defaultValue });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, labelStyles]}>{label}</Text>}
      <View style={styles.inputContainer}>
        <RNTextInput
          style={[
            styles.input,
            disabled && styles.disabledInput,
            errors[name] && styles.errorInput,
          ]}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          editable={!disabled}
          {...inputProps}
        />
        {secureTextEntry && !disabled && (
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
    color: "grey",
    fontSize: 14,
    marginBottom: 4,
  },
  container: {
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // Default border color
    paddingBottom: 4,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    padding: 0,
    color: "black", // Text color
  },
  icon: {
    marginLeft: 8,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  errorInput: {
    borderBottomColor: "red", // Highlight border in red if there's an error
  },
  disabledInput: {
    backgroundColor: "transparent", // Ensure no background color
    color: "#888", // Light gray text color
  },
});
