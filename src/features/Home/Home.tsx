import { LoginFlow, UpdateLoginFlowBody, Session } from "@ory/client";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { handleGetFlowError, handleFlowError } from "../../utils/errors";
import ory from "../../sdk";
import { LogoutLink } from "../../utils/logout";
import { useNavigate, useParams } from "react-router-dom";
import { VStack, Button, Text } from "@chakra-ui/react";

export const Home = (): JSX.Element => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const onLogout = LogoutLink(navigate);

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        setSession(data);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401:
            // the user is not logged in
            navigate("/login");
            return;
        }

        // Something else happened!
        return Promise.reject(err);
      });
  }, []);

  return (
    <VStack w="100%" h="100vh" justify="center" align="center">
      <Text>Hello, {session?.identity.traits.name}</Text>
      <Text>
        <Button variant="link" onClick={onLogout}>
          Click here
        </Button>{" "}
        to logout
      </Text>
    </VStack>
  );
};
