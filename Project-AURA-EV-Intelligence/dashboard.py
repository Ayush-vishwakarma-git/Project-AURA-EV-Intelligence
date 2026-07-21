import streamlit as st

st.set_page_config(page_title="Project AURA Dashboard", layout="wide")

st.title("Project AURA: EV Intelligence Dashboard")

st.markdown("""
### Operational Readiness

This dashboard is a placeholder for the industrial EV transition command center.
""")

st.metric("Fleet Readiness", "70%")
st.metric("Supply Risk", "High")

st.subheader("Agent Summary")
st.write("- Battery APM: SoH monitoring and maintenance alerts")
st.write("- Supply Chain Risk: HHI and geopolitical flagging")
st.write("- Fleet Optimizer: readiness and model recommendations")
