import {
  LoginFlow,
  UiNode,
  UiNodeInputAttributes,
  UpdateLoginFlowBody,
} from "@ory/client";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import ory from "../../sdk";
import { useNavigate, Link as ReachLink } from "react-router-dom";
import { Button, Flex, Input, Link, Text, VStack } from "@chakra-ui/react";

export const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [flow, setFlow] = useState<LoginFlow>();

  useEffect(() => {
    ory
      .createBrowserLoginFlow()
      .then(({ data }) => {
        setFlow(data);
      })
      .catch((err) => {
        // Couldn't retrieve the login flow
      });
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    // map the entire form data to JSON for the request body
    let body = Object.fromEntries(formData) as unknown as UpdateLoginFlowBody;

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
      .updateLoginFlow({
        flow: flow?.id || "",
        updateLoginFlowBody: body,
      })
      .then(() => {
        navigate("/", { replace: true });
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
            <Text>Login</Text>
          </Button>
        );
      default:
        return (
          <Input
            key={key}
            borderColor="gray.300"
            name={attrs.name}
            type={attrs.type}
            placeholder={attrs.name === "identifier" ? "Email" : "Password"}
            defaultValue={attrs.value}
            required={attrs.required}
            disabled={attrs.disabled}
          />
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
      <Text fontSize={"2xl"}>Login</Text>
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
      <Link color="blue.500" as={ReachLink} to="/registration">
        Create an account
      </Link>
    </VStack>
  );
};
