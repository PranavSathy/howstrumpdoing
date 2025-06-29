from typing import List

from crewai import LLM, Agent, Crew, Process, Task
from crewai_tools import SerperDevTool, WebsiteSearchTool
from pydantic import BaseModel


class ResearchTopics(BaseModel):
    topics: List[str]


class JournalismAi:
    """JournalismAI crew with topic discovery and deep-dive research pipeline"""

    def __init__(self, agents_config, tasks_config):
        self.agents_config = agents_config
        self.tasks_config = tasks_config

        # Tools
        self.serper_tool = SerperDevTool()
        self.website_scraper_tool = WebsiteSearchTool()

        # Agents
        self.editor = Agent(
            config=self.agents_config["editor"],
            allow_delegation=True,
            tools=[self.serper_tool],
            verbose=True,
        )
        self.researcher = Agent(
            config=self.agents_config["researcher"],
            tools=[self.serper_tool, self.website_scraper_tool],
            verbose=True,
        )
        self.analyst = Agent(
            config=self.agents_config["analyst"],
            tools=[self.serper_tool],
            verbose=True,
        )

    def run(self):
        # STEP 1: Topic Discovery
        topic_discovery_task = Task(
            config=self.tasks_config["topic_discovery_task"],
            agent=self.editor,
            output_pydantic=ResearchTopics,
        )

        topic_finder_crew = Crew(
            agents=[self.editor],
            tasks=[topic_discovery_task],
            process=Process.sequential,
            verbose=True,
        )

        topic_list_output: ResearchTopics = (
            topic_finder_crew.kickoff().tasks_output[0].pydantic
        )

        print("----- TOPICS DISCOVERED -----")
        print(topic_list_output.topics)

        # STEP 2: Deep Dive Research Tasks
        deep_dive_tasks = []
        for topic in topic_list_output.topics:
            task_description = self.tasks_config["deep_dive_research_task_template"][
                "description"
            ].format(topic=topic)
            deep_dive_task = Task(
                config=self.tasks_config["deep_dive_research_task_template"],
                description=task_description,
                agent=self.researcher,
            )
            deep_dive_tasks.append(deep_dive_task)

        # STEP 3: Synthesis Task
        synthesis_task = Task(
            config=self.tasks_config["synthesis_task"],
            agent=self.analyst,
            context=deep_dive_tasks + [topic_discovery_task],
        )

        # STEP 4: Main Crew
        main_crew = Crew(
            agents=[self.editor, self.researcher, self.analyst],
            tasks=deep_dive_tasks + [synthesis_task],
            process=Process.hierarchical,
            manager_llm=LLM(model="gemini-2.5-pro"),
            verbose=True,
        )

        final_result = main_crew.kickoff()
        return final_result
