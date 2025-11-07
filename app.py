import streamlit as st
import json
from datetime import datetime

st.set_page_config(page_title="AI Mental Health Assistant", layout="wide")

st.title("🧠 Mental Health Self-Help and Assessment App")
st.markdown("Welcome to your AI-based self-psychoeducation and rehabilitation assistant.")

menu = st.sidebar.selectbox("Navigate", ["Home", "Self Assessment", "AI Chat", "Psychoeducation", "Progress Tracking"])

if menu == "Home":
    st.subheader("Your Mental Health Companion")
    st.write("This platform helps you understand your emotions, assess your wellbeing, and learn coping strategies.")
    st.info("Disclaimer: This tool does not replace professional medical advice. If you feel distressed, seek professional help.")

elif menu == "Self Assessment":
    st.subheader("🧩 Self-Risk Screening Tools")
    st.write("Select a test below to assess your emotional wellbeing.")
    selected_test = st.radio("Choose an assessment", ["PHQ-9 (Depression)", "GAD-7 (Anxiety)", "WHO-5 (Wellbeing)"])

    if selected_test:
        with open("data/assessments.json") as f:
            assessments = json.load(f)
        questions = assessments.get(selected_test, [])
        responses = []
        for q in questions:
            responses.append(st.slider(q, 0, 3, 0))
        if st.button("Submit"):
            total = sum(responses)
            st.success(f"Your total score: {total}")
            st.write("Interpretation guidelines:")
            st.write("0–4: Minimal, 5–9: Mild, 10–14: Moderate, 15+: Severe")

elif menu == "AI Chat":
    st.subheader("💬 AI Emotional Support Chat")
    st.write("Talk with your AI assistant to explore your thoughts and feelings.")
    user_input = st.text_area("You:", "")
    if st.button("Send"):
        st.write("**AI:** I'm here to listen. Remember, taking time to reflect is the first step to healing.")

elif menu == "Psychoeducation":
    st.subheader("📘 Psychoeducation Modules")
    st.write("Explore mental health education topics:")
    topics = ["Stress Management", "Mindfulness", "CBT Basics", "Sleep Hygiene"]
    choice = st.selectbox("Choose a topic", topics)
    st.write(f"### {choice}")
    st.write("Content will appear here in full version.")

elif menu == "Progress Tracking":
    st.subheader("📈 Progress Tracker")
    mood = st.slider("How do you feel today?", 0, 10, 5)
    if st.button("Log Mood"):
        st.success(f"Mood {mood}/10 logged successfully on {datetime.now().strftime('%Y-%m-%d')}!")
