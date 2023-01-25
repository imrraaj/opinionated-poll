import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Formik, Form } from "formik";
import { FiPlus, FiX } from "react-icons/fi";
import { api } from "../utils/api";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface Poll {
  question: string;
  options: string[];
}
const Create: NextPage = () => {
  const router = useRouter();

  const { mutate: addMutation } = api.poll.addPoll.useMutation();
  const onSubmit = (data: Poll) => {
    const id = toast.loading("Creating poll...");
    console.log(data.question);
    addMutation(
      {
        question: data.question,
        options: data.options,
      },
      {
        onSuccess(data) {
          toast.success("Poll created successfully!", { id });
          console.log(data.pollQuestion.id);
          router.push("/poll/result/" + data.pollQuestion.id);
        },
        onError() {
          toast.error("Failed to create a poll", { id });
        },
      }
    );
  };

  return (
    <>
      <Head>
        <title>Opinionated Poll - Create A New Poll</title>
      </Head>
      <Link
        href="/"
        className="absolute cursor-pointer font-semibold text-gray-500 underline"
      >
        ../create
      </Link>
      <main className="my-8 flex flex-col items-center justify-center px-4">
        <h2 className="mt-16 text-4xl font-black text-gray-500">Create Poll</h2>
        <PollForm onSubmit={onSubmit} />
      </main>
    </>
  );
};

export default Create;

interface props {
  onSubmit: (data: Poll) => void;
}
const PollForm = ({ onSubmit = () => null }: props) => {
  const [disabled, setDisabled] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [newOption, setNewOption] = useState("");

  const handleSubmit = () => {
    setDisabled(true);
    if (question.length > 0) {
      onSubmit({ question, options });
    } else {
      toast.error("Please add a question!");
      setDisabled(false);
    }
  };
  return (
    <div className="my-4 w-full max-w-3xl">
      <Formik
        initialValues={{ question: "", option: "" }}
        validator={() => {}}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid }: { isSubmitting: any; isValid: any }) => (
          <Form className="flex h-full w-full flex-col gap-3 font-sans">
            <div className="form-group flex w-full flex-col">
              <label htmlFor="question" className="font-medium text-gray-600">
                Question
              </label>
              <input
                type="text"
                name="question"
                id="question"
                className="form-control w-full rounded border-2 border-gray-400 px-4 py-2 text-gray-700"
                placeholder="Enter question"
                disabled={disabled}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div className="form-group flex w-full flex-col">
              <label htmlFor="option" className="text-gray-600">
                Add New Option
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  name="option"
                  id="option"
                  className="form-control w-full rounded border-2 border-gray-400 bg-white px-4 py-2  text-gray-700"
                  placeholder="Enter option"
                  disabled={disabled}
                  onChange={(e) => setNewOption(e.target.value)}
                  value={newOption}
                />

                <button
                  type="button"
                  className="rounded bg-emerald-400 px-4 py-2 text-gray-800 ring-emerald-500 duration-300 hover:ring-2"
                  disabled={!isValid}
                  onClick={() => {
                    if (newOption) {
                      setOptions((prev) => [...prev, newOption]);
                      setNewOption("");
                    } else {
                      toast.error("Please enter an option!");
                    }
                  }}
                >
                  <FiPlus />
                </button>
              </div>
            </div>
            {options.length > 0 && (
              <div className="flex cursor-context-menu flex-col gap-3 py-1">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-3 ">
                    <input
                      type="text"
                      className="form-control w-full rounded border-2 border-gray-400 bg-emerald-100 px-4 py-2 "
                      disabled={true}
                      value={option}
                    />
                    <button
                      type="button"
                      className="rounded bg-red-400 px-4 py-2 text-gray-800 ring-red-500 duration-300 hover:ring-2"
                      disabled={!isValid}
                      onClick={() => {
                        const newOptions = [...options];
                        newOptions.splice(index, 1);
                        setOptions(newOptions);
                      }}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="submit"
              className="cursor-pointer rounded bg-emerald-400 px-4 py-2 text-black ring-emerald-500 duration-300 hover:ring-2"
              disabled={!isValid}
            >
              Create Poll
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export const getStaticProps = () => {
  return {
    props: { auth: true },
  };
};
