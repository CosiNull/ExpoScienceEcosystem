let thread1 = new Thread(() => {
  sleep(1000);
  console.log("I have slept for one sec");
});
console.log(" I am running in the main thread while thread one is sleeping");
thread1.join();
