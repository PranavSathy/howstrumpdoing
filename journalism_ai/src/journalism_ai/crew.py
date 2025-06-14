from typing import List

from crewai import Agent, Crew, Process, Task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import SerperDevTool

# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators

search_tool = SerperDevTool()
# web_rag_tool = WebsiteSearchTool()


@CrewBase
class JournalismAi:
    """JournalismAi crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    # Learn more about YAML configuration files here:
    # Agents: https://docs.crewai.com/concepts/agents#yaml-configuration-recommended
    # Tasks: https://docs.crewai.com/concepts/tasks#yaml-configuration-recommended

    # If you would like to add tools to your agents, you can learn more about it here:
    # https://docs.crewai.com/concepts/agents#agent-tools
    @agent
    def researcher(self) -> Agent:
        return Agent(
            config=self.agents_config["researcher"],  # type: ignore[index]
            # role="Political Research Analyst",
            # goal="Find and identify the most impactual/consequental political events/policy events.",
            # backstory="An expert analyst with a keen eye for key political issues regarding the Trump administration.",
            tools=[search_tool],
            verbose=True,
        )

    @agent
    def analyst(self) -> Agent:
        return Agent(
            config=self.agents_config["analyst"],  # type: ignore[index]
            # role="Content Writer",
            # goal="Craft simple, non-biased news articles summarizing political events easily for the average American.",
            # backstory="A completely unbiased , skilled writer with an eye for detail.",
            verbose=True,
        )

    # To learn more about structured task outputs,
    # task dependencies, and task callbacks, check out the documentation:
    # https://docs.crewai.com/concepts/tasks#overview-of-a-task
    @task
    def research_task(self) -> Task:
        return Task(
            config=self.tasks_config["research_task"]  # type: ignore[index]
            # agent=self.researcher,
            # description="Research key events regarding the Trump administration's policies between June 7th, 2025 to June 12th, 2025.",
            # expected_output="A summary of all the key events and their intended consequences while maintaining complete non-partisan commentary.",
        )

    @task
    def analysis_task(self) -> Task:
        return Task(
            config=self.tasks_config["analysis_task"],  # type: ignore[index]
            output_file="output/report.md",
            # agent=self.reporting_analyst,
            # description="Write an engaging news article about recent policy/political events, based on the political research analyst's summary. Keep it short, direct and factual only.",
            # expected_output="A 4-paragraph news article formatted in markdown with engaging, informative, and accessible content, avoiding complex jargon.",
            # output_file="report.md",
        )

    @crew
    def crew(self) -> Crew:
        """Creates the JournalismAi crew"""
        # To learn how to add knowledge sources to your crew, check out the documentation:
        # https://docs.crewai.com/concepts/knowledge#what-is-knowledge

        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,  # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
            # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
        )
