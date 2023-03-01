import {
  LoginFlow,
  UiNode,
  UiNodeInputAttributes,
  UpdateRegistrationFlowBody,
} from "@ory/client";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import ory from "../../sdk";
import { useNavigate } from "react-router-dom";
import { useSearchParams, Link as ReachLink } from "react-router-dom";
import { Button, Flex, Input, Link, Text, VStack } from "@chakra-ui/react";

export const Registration = (): JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [flow, setFlow] = useState<LoginFlow>();

  useEffect(() => {
    // we can redirect the user back to the page they were on before login
    const returnTo = searchParams.get("return_to");

    ory
      .createBrowserRegistrationFlow()
      .then(({ data: flow }) => {
        // set the flow data
        setFlow(flow);
      })
      .catch((err) => {
        // Couldn't create registration flow
        // handle the error
      });
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    // map the entire form data to JSON for the request body
    let body = Object.fromEntries(
      formData
    ) as unknown as UpdateRegistrationFlowBody;

    // We need the method specified from the name and value of the submit button.
    // when multiple submit buttons are present, the clicked one's value is used.
    if ("submitter" in event.nativeEvent) {
      const method = (
        event.nativeEvent as unknown as { submitter: HTMLInputElement }
      ).submitter;
      body = {
        ...body,
        ...{ [method.name]: method.value },
      };
    }

    ory
      .updateRegistrationFlow({
        flow: flow?.id || "",
        updateRegistrationFlowBody: body,
      })
      .then(() => {
        navigate("/login", { replace: true });
      })
      .catch((err: AxiosError) => {
        // handle the error
        if (err?.response?.status === 400) {
          // user input error
          // show the error messages in the UI
          setFlow(err.response.data);
        }
      });
  };

  const mapUINode = (node: UiNode, key: number) => {
    const attrs = node.attributes as UiNodeInputAttributes;
    const nodeType = attrs.type;

    switch (nodeType) {
      case "button":
      case "submit":
        return (
          <Button
            key={key}
            w="50%"
            alignSelf={"center"}
            colorScheme="blue"
            type={attrs.type as "submit" | "reset" | "button" | undefined}
            name={attrs.name}
            value={attrs.value}>
            <Text>Register</Text>
          </Button>
        );
      default:
        return (
          <>
            <Input
              key={key}
              borderColor="gray.300"
              variant="filled"
              name={attrs.name}
              type={attrs.type}
              placeholder={node.meta.label?.text || "Enter"}
              defaultValue={attrs.value}
              required={attrs.required}
              disabled={attrs.disabled}
            />
            <Text>{node.messages[0]?.text}</Text>
          </>
        );
    }
  };

  const getErrorMessage = () => {
    if (!flow?.ui.messages) return "";
    const error = flow?.ui.messages.find((m) => m.type === "error")?.text;
    return error || "";
  };

  return (
    <VStack w="100%" h="100vh" justify="center">
      <Text fontSize={"2xl"}>Registration</Text>
      {flow ? (
        <form
          style={{ width: "300px" }}
          action={flow.ui.action}
          method={flow.ui.method}
          onSubmit={onSubmit}>
          <Flex flexDir={"column"} gap="8px" alignItems="center">
            {flow.ui.nodes.map((node, idx) => mapUINode(node, idx))}
            <Text>{getErrorMessage()}</Text>
          </Flex>
        </form>
      ) : (
        <Text>Loading...</Text>
      )}
      <Link color="blue.500" as={ReachLink} to="/login">
        Log in
      </Link>
    </VStack>
  );
};
