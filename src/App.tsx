// import { useEffect, useState } from "react";
// import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
// import { generateClient } from "aws-amplify/data";
// import PreSurvey from "./PreSurvey";
// import AdminControl from "./AdminControl";

// const client = generateClient<Schema>();

function App() {
  const { signOut } = useAuthenticator();
  // const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  // useEffect(() => {
  //   client.models.Todo.observeQuery().subscribe({
  //     next: (data) => setTodos([...data.items]),
  //   });
  // }, []);

  // function createTodo() {
  //   client.models.Todo.create({ content: window.prompt("Todo content") });
  // }
    
  // function deleteTodo(id: string) {
  //   client.models.Todo.delete({ id })
  // }

  return (
    <main>
      {/* <PreSurvey /> */}
      {/* <AdminControl /> */}
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
