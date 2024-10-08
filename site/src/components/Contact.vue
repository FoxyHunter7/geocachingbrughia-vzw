<script setup>
    import { computed, ref, Static } from 'vue';
    import LanguageProvider from '@/services/LanguageService';
    import StaticContentProvider from '@/services/StaticContentService';
    import { postContact } from '@/services/ContactService';

    const scsErrors = StaticContentProvider.ERRORS;

    const lang = computed(() => LanguageProvider.CURR_LANG.value);
    const dictionary = StaticContentProvider.DICTIONARY;

    const email = ref("");
    const subject = ref("");
    const message = ref("");

    const lastSubmitResult = ref("");
    async function handleFormSubmit() {
        const response = await postContact(email.value, subject.value, message.value);

        email.value = "";
        subject.value = "";
        message.value = "";

        if (response.success && response.data && response.data.data) {
            lastSubmitResult.value = dictionary.FormSuccess[lang.value];
        } else {
            lastSubmitResult.value = dictionary.FormFailed[lang.value];
        }
    }
</script>

<template>
    <section>
        <h2>{{ dictionary.ContactHelpQuestionTxt[lang] }}</h2>
        <p>{{ dictionary.ContactHelpTxt[lang] }}</p>
        <div>
            <form method="post" @submit.prevent="handleFormSubmit" v-if="!scsErrors">
                <div>
                    <label for="email">{{ dictionary.FormMail[lang] }}</label>
                    <input v-model="email" type="email" id="email" name="email" autocomplete="email" required>
                </div>
                <div>
                    <label for="subject">{{ dictionary.FormSubject[lang] }}</label>
                    <input v-model="subject" type="text" id="subject" name="subject" autocomplete="off" max="100" required>
                </div>
                <div>
                    <label for="message">{{ dictionary.FormMessage[lang] }}</label>
                    <textarea v-model="message" id="message" name="message" autocomplete="off" max="5000" required></textarea>
                </div>
                <div>
                    <input type="submit" :value="dictionary.FormSubmit[lang]">
                    <p>{{ lastSubmitResult }}</p>
                </div>
            </form>
            <ul :class="{'alone': scsErrors}">
                <li>
                    <p>{{ dictionary.ContactPostalMailTxt[lang] }}</p>
                    <a target="_blank" href="https://www.google.com/maps/place/Korte+Kwadeplasstraat+6,+8020+Oostkamp/@51.1593091,3.2333893,17z/data=!3m1!4b1!4m6!3m5!1s0x47c3506bbbd8d363:0xbed866c1f1258d86!8m2!3d51.1593091!4d3.2359696!16s%2Fg%2F11rcy98rq8?entry=ttu">Korte Kwadeplasstraat 6, 8020 Oostkamp</a>
                </li>
                <li>
                    <p>{{ dictionary.ContactCallTxt[lang] }}</p>
                    <a href="tel:+32 50 841 331">+32 50 841 331</a>
                    <a href="tel:+32 487 906 431">+32 487 906 431</a>
                </li>
                <li>
                    <p>{{ dictionary.ContactMailTxt[lang] }}</p>
                    <a href="mailto:info@geocachingbrughia.be">info@geocachingbrughia.be</a>
                </li>
            </ul>
        </div>
    </section>
</template>

<style scoped>
    section {
        padding: 3rem;
        max-height: 40rem;
        height: max-content !important;
        margin-bottom: 0 !important;
    }

    h2 {
        text-align: center; 
        font-weight: bold;
    }

    h2::first-letter {
        text-transform: uppercase;
    }

    section > p {
        text-align: center;
        line-height: 200%;
        font-size: 1rem;
        margin-bottom: 3rem;
    }

    section > div {
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        gap: 5rem;
        margin: auto;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    form div {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }

    form div:last-child {
        flex-direction: row;
        align-items: center;
        gap: 2rem;
    }

    form div:last-child p {
        text-transform: capitalize;
        font-weight: bold;
        font-size: 0.8rem;
        padding-top: 0.5rem;
    }

    form label {
        text-transform: capitalize;
    }

    form > div input {
        width: 30rem;
        max-width: 90vw;
    }

    form input, form textarea {
        height: 2rem;
        border-radius: 0.3rem;
        border: solid 0.1rem var(--color-text);
        outline: none;
        font-family: inherit;
        font-size: 0.85rem;
        box-sizing: border-box;
        background-color: var(--color-background);
        color: var(--color-text)
    }

    form textarea {
        height: 8rem;
        resize: vertical;
    }

    form input[type="submit"] {
        background-color: var(--color-accent-light);
        border: none;
        width: 9rem;
        height: 2rem;
        font-family: inherit;
        border-radius: 0.4rem;
        text-transform: capitalize;
        font-weight: bold;
        scale: 100%;
        transition: scale 0.15s;
    }

    form input[type="submit"]:hover {
        cursor: pointer;
        scale: 103%;
        transition: scale 0.25s;
    }

    ul {
        width: 30rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-inline-start: 0rem;
        list-style: none;
        text-transform: capitalize;
    }

    ul.alone {
        flex-direction: row;
        justify-content: space-between;
        width: 60rem;
        align-items: flex-start;
    }

    ul.alone li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    li {
        display: block;
        width: 20rem;
        margin-bottom: 1.5rem;
    }

    li a {
        display: block;
        margin-top: 0.3rem;
        text-decoration: underline;
        color: var(--color-accent-dark);
        font-weight: normal;
    }

    li a:hover {
        font-weight: bold;
    }

    @media screen and (max-width: 80rem) {
        form > div input {
            width: 25rem;
        }

        ul {
            width: 25rem;
        }
    }

    @media screen and (max-width: 50rem) {
        section {
            padding: 1rem;
        }

        ul {
            text-align: center;
            width: 100%;
        }

        form input[type="submit"] {
            align-self: center;
            margin-top: 1rem;
        }
    }
</style>