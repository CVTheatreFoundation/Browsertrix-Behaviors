class MeetingSelector
{
  static id = "MeetingSelector";
  static run_command = "auto";

  static isMatch() {
    // Check if there's a select element with id containing "ddlMeetings"
    return !!document.querySelector('select[id*="ddlMeetings"]');
  }

  static init() {
    return {};
  }

  async* run(ctx) {
    const { log, Lib } = ctx;
    
    // Find the select element
    const selectElement = document.querySelector('select[id*="ddlMeetings"]');
    if (!selectElement) {
      log("No meeting dropdown found");
      return;
    }

    // Get all options that start with "20"
    const options = Array.from(selectElement.options)
      .filter(option => option.value.startsWith('20'));
    
    if (options.length === 0) {
      log("No options found starting with '20'");
      return;
    }

    log(`Found ${options.length} options starting with '20'`);
    
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      
      // Click the select to open the dropdown
      selectElement.click();
      yield Lib.getState(ctx, `Opened dropdown for option ${i + 1}`, "clicks");
      
      // Small delay to let dropdown open
      await Lib.sleep(500);
      
      // Set the select value to trigger any associated events
      selectElement.value = option.value;
      
      // Dispatch change event to ensure any listeners are triggered
      selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      
      yield Lib.getState(ctx, `Selected option ${i + 1} of ${options.length}: ${option.text} (value: ${option.value})`, "clicks");
      
      // Wait 1 second before next selection
      await Lib.sleep(1000);
    }

    yield Lib.getState(ctx, "Finished cycling through all matching options");
  }
} 