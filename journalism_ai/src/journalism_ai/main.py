#!/usr/bin/env python
import warnings
from datetime import datetime

import yaml

# from journalism_ai.config.agents import agents_config
# from journalism_ai.config.tasks import tasks_config
from journalism_ai.crew import JournalismAi

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")


def load_yaml(path):
    with open(path, "r") as f:
        return yaml.safe_load(f)


# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

agents_config = load_yaml("src/journalism_ai/config/agents.yaml")
tasks_config = load_yaml("src/journalism_ai/config/tasks.yaml")


def run():
    try:
        crew = JournalismAi(agents_config, tasks_config)
        crew.run()
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")


# def run():
#     """
#     Run the crew.
#     """
#     inputs = {"topic": "AI LLMs", "current_year": str(datetime.now().year)}

#     try:
#         JournalismAi().crew().kickoff(inputs=inputs)
#     except Exception as e:
#         raise Exception(f"An error occurred while running the crew: {e}")


# def train():
#     """
#     Train the crew for a given number of iterations.
#     """
#     inputs = {"topic": "AI LLMs", "current_year": str(datetime.now().year)}
#     try:
#         JournalismAi().crew().train(
#             n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs
#         )

#     except Exception as e:
#         raise Exception(f"An error occurred while training the crew: {e}")


# def replay():
#     """
#     Replay the crew execution from a specific task.
#     """
#     try:
#         JournalismAi().crew().replay(task_id=sys.argv[1])

#     except Exception as e:
#         raise Exception(f"An error occurred while replaying the crew: {e}")


# def test():
#     """
#     Test the crew execution and returns the results.
#     """
#     inputs = {"topic": "AI LLMs", "current_year": str(datetime.now().year)}

#     try:
#         JournalismAi().crew().test(
#             n_iterations=int(sys.argv[1]), eval_llm=sys.argv[2], inputs=inputs
#         )

#     except Exception as e:
#         raise Exception(f"An error occurred while testing the crew: {e}")


if __name__ == "__main__":
    run()
